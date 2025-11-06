import path from "node:path";
import { createRequire } from "node:module";
import { parse, stringify } from "css";
import { globSync } from "glob";
import { readFile } from "./utilities.mjs";
const require = createRequire(import.meta.url);
const pfStylesDir = path.dirname(require.resolve("@patternfly/patternfly/patternfly.css"));
const cssFileGlobs = [
    "{**/{components,layouts}/**/*.css",
    "**/patternfly-charts.css",
    "**/patternfly-variables.css}",
].join(",");
const cssFileGlobOpts = {
    cwd: pfStylesDir,
    ignore: ["assets/**"],
    absolute: true,
};
const patternflyRoot = "--pf-v5";
const formatCustomPropertyName = (key) => key.replace("--pf-v5-", "");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObj = (v) => typeof v === "object" && v !== null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isCssObj = (v) => isObj(v) && "type" in v;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isCssType = (v, t) => isCssObj(v) && v.type === t;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isRule = (node) => isCssType(node, "rule");
export const isDeclaration = (v) => isCssType(v, "declaration") &&
    "property" in v &&
    "value" in v &&
    typeof v.property === "string" &&
    typeof v.value === "string";
const hasNoDarkSelectors = (node) => isRule(node) &&
    (!node.selectors || !node.selectors.some((item) => item.includes(".pf-v5-theme-dark")));
function getRegexMatches(s, r) {
    const res = {};
    while (true) {
        const matches = r.exec(s);
        if (!matches) {
            break;
        }
        res[matches[1]] = matches[2].trim();
    }
    return res;
}
const isHardDeclaration = (node) => typeof node === "object" &&
    node !== null &&
    "type" in node &&
    node.type === "declaration" &&
    typeof node.property === "string" &&
    typeof node.value === "string";
// From a given stylesheet, return every *declaration* key that starts with `--pf-v5` and the
// *last value* associated with it.
//
function getDeclarations(cssAst) {
    const isNotDarkRule = (rule) => !(rule.selectors ?? []).includes(".pf-v5-t-dark");
    const extractDeclarations = (rule) => (rule.declarations ?? [])
        .filter(isHardDeclaration)
        .map((decl) => ({ ...decl, parent: decl.parent ?? rule }));
    const rules = cssAst.stylesheet?.rules ?? [];
    return rules
        .filter((node) => isRule(node))
        .filter((rule) => isNotDarkRule(rule) && hasNoDarkSelectors(rule))
        .map(extractDeclarations)
        .reduce((acc, decls) => [...acc, ...decls], []);
}
export const tap = (a) => {
    console.debug(a);
    return a;
};
function buildLocalVarsMapGetter(cssFiles) {
    // For all of the CSS files passed to it, gets the declarations and creates a map for each CSS
    // Custom Property to the selectors that are associated with it. Note: see this one in action.
    function makeLocalVarsMap(cssFiles) {
        const res = {};
        for (const cssFile of cssFiles) {
            const cssAst = parse(readFile(cssFile));
            for (const { property, value, parent } of getDeclarations(cssAst)) {
                if (typeof value === "string" &&
                    typeof property === "string" /* && property.startsWith(patternflyRoot) */) {
                    const propertyName = parent.selectors?.[0];
                    if (typeof propertyName === "string") {
                        res[property] = {
                            ...res[property],
                            [propertyName]: value,
                        };
                    }
                }
            }
        }
        return res;
    }
    // I have the feeling this is hard-won knowledge.
    const sanitizeKey = (key) => key
        .replace(/\*$/, "")
        .trim()
        .replace(/>$/, "")
        .trim()
        .replace(/\[.*\]$/, "") // eslint-disable-line sonarjs/slow-regex
        .trim();
    const localVarsMap = makeLocalVarsMap(cssFiles);
    // Create a lookup from a property and a selector match, so return the value most closely
    // associated with that property in that selector. This function is rather, ah, *loose* in its
    // interperetation of "closest," but it's the best we can do under the circumstances.
    const getFromLocalVarsMap = (match, selector) => {
        const propMatch = localVarsMap[match];
        if (!propMatch) {
            // console.error(`no matching property found for ${match} in localVarsMap`);
            return;
        }
        // Exact selector match
        if (propMatch[selector]) {
            return propMatch[selector];
        }
        // If the property match has only one value, return it.
        if (Object.keys(propMatch).length === 1) {
            return Object.values(propMatch)[0];
        }
        let bestMatch = "";
        let bestValue = "";
        for (const key in localVarsMap[match]) {
            if (Object.hasOwn(localVarsMap[match], key)) {
                // remove trailing * from key to compare
                const sanitizedKey = sanitizeKey(key);
                if (selector.indexOf(sanitizedKey) > -1) {
                    if (sanitizedKey.length > bestMatch.length) {
                        // longest matching key is the winner
                        bestMatch = key;
                        bestValue = localVarsMap[match][key];
                    }
                }
            }
        }
        if (!bestMatch) {
            // console.error(`no matching selector found for ${match} in localVarsMap`);
        }
        return bestValue;
    };
    return getFromLocalVarsMap;
}
// Patternfly's palette of colors is stored in the file
// "@patternfly/patternfly/sass-utilities/colors.scss". This function extracts rows of:
//
// `$pf-v5-color-light-blue-500:        #008bad !default;`
//
// into a table of:
//
// { "$pf-v5-color-light-blue-500": "#008bad" }
//
function getScssColorsMap() {
    const scssColorVariables = readFile(require.resolve("@patternfly/patternfly/sass-utilities/colors.scss"));
    const scssColorsMap = getRegexMatches(scssColorVariables, /(\$.*):\s*([^\s]+)\s*(?:!default);/g // eslint-disable-line sonarjs/slow-regex
    );
    return scssColorsMap;
}
// Patternfly's default theme is stored in the file
// `@patternfly/patternfly/sass-utilities/scss-variables.scss`. This function extracts rows of:
//
// `$pf-v5-global--BackgroundColor--dark-transparent-200:  rgba($pf-v5-color-black-1000, .32) !default;`
//
// into a map of:
//
// { "$pf-v5-global--BackgroundColor--dark-transparent-200": "rgba($pf-v5-color-black-1000, .32)" }
//
function getScssVarsMap() {
    const scssVariables = readFile(require.resolve("@patternfly/patternfly/sass-utilities/scss-variables.scss"));
    const scssVarsMap = getRegexMatches(scssVariables, /(\$.*):\s*([^;^!]+)/g // eslint-disable-line sonarjs/slow-regex
    );
    return scssVarsMap;
}
// Having derived the tables from the prior two functions, this function returns a function that
// encloses all of those values and returns a lookup function. The lookup starts with anything that
// starts with `$pf` and continues until it encounters on of `, ) * /` or space. (I have my
// suspicion that's a regex that works by coincidence, rather than by design.) Either that, or there
// are some odd bits of brokenness in the Patternfly CSS. Having tested it, though, it seems
// reliable enough.
//
function makeScssVarValueGetter() {
    const combinedScssVarsColorsMap = {
        ...getScssVarsMap(),
        ...getScssColorsMap(),
    };
    const getComputedScssVarValue = (value) => value.replace(/\$pf[^,)\s*/]*/g, (match) => {
        if (combinedScssVarsColorsMap[match]) {
            return combinedScssVarsColorsMap[match];
        }
        else {
            return match;
        }
    });
    return getComputedScssVarValue;
}
// In the file `@patternfly/patternfly/base/_variables.scss`, Patternfly's theme layer maps the
// variables stored in SCSS into CSS Custom Properties.  This function extracts rows of:
//
//  `--#{$pf-global}--palette--green-500: #{$pf-v5-color-green-500};`
//
// into a map of:
//
//  { "--pf-v5-global--palette--green-500": "$pf-v5-color-green-500" }
//
function getCssGlobalsToScssVarsMap() {
    const variables = readFile(require.resolve("@patternfly/patternfly/base/_variables.scss")).replaceAll("#{$pf-global}", "pf-v5-global");
    const cssGlobalsToScssVarsMap = getRegexMatches(variables, /(--pf-.*):\s*(?:#{)?(\$?pf-[\w -]+)}?;/g);
    return cssGlobalsToScssVarsMap;
}
const cssGlobalsToScssVarsMap = getCssGlobalsToScssVarsMap();
// The file `@patternfly/patternfly/base/patternfly-variables.css` contains the complete list of all
// the CSS Custom Properties that define the Patternfly theme *after* they've been processed with
// Sass. None of these custom properties dereference other properties; they are whole and entire
// here. On the one hand, this is good: the entire theme is out in the open where you can see it. On
// the other hand, it does mean that, for example, the global `warning-color` is defined in RGB, not
// in terms of the variable in the palette that corresponds to it. If it had, it would have been
// `gold-400`, which I would have preferred.
//
// As before, the conversion is:
//
// `--pf-v5-global--palette--green-100: #bde5b8;`
//
// into:
//
// { "--pf-v5-global--palette--green-100": "#bde5b8" }
//
function getCssGlobalVariablesMap() {
    const cssGlobalVariablesAst = parse(readFile(require.resolve("@patternfly/patternfly/base/patternfly-variables.css")));
    if (!cssGlobalVariablesAst.stylesheet?.rules) {
        throw new Error("Was unable to load patternfly-variables");
    }
    cssGlobalVariablesAst.stylesheet.rules =
        cssGlobalVariablesAst.stylesheet.rules.filter(hasNoDarkSelectors);
    const cssGlobalVariablesMap = getRegexMatches(stringify(cssGlobalVariablesAst), 
    // eslint-disable-next-line sonarjs/slow-regex,sonarjs/duplicates-in-character-class
    /(--pf-[\w-]*):\s*([\w -_]+);/g);
    return cssGlobalVariablesMap;
}
const cssGlobalVariablesMap = getCssGlobalVariablesMap();
function formatFilePathToName(filePath) {
    return path.basename(filePath);
}
function makeCSSVarValueGetter(cssFiles) {
    const getFromLocalVarsMap = buildLocalVarsMapGetter(cssFiles);
    const getComputedCSSVarValue = (value, selector, varMap) => {
        return value.replace(/var\(([\w-]*)(,.*)?\)/g, (full, m1, m2) => {
            if (m1.startsWith("--pf-v5-global")) {
                return varMap[m1] ? varMap[m1] + (m2 || "") : full;
            }
            if (selector) {
                return getFromLocalVarsMap(m1, selector) + (m2 || "");
            }
            return "----unknown----";
        });
    };
    return getComputedCSSVarValue;
}
// The architecture of Patternfly 5 can produce a truly silly number of references to get from a
// component's property value to where the concrete value orginated, modulo the comment above
// that the theme file uses concrete final values for many colors, rather than taking them from
// the palette.
//
// This function creates an array of the entire "stack" of variables from their place-of-use all
// the way back to where they're firl defined.
function buildVarsMapGetter(cssFiles) {
    const getComputedScssVarValue = makeScssVarValueGetter();
    const getComputedCSSVarValue = makeCSSVarValueGetter(cssFiles);
    const getVarsMap = (value, selector) => {
        const varsMap = [value];
        let computedValue = value;
        let finalValue = value;
        // We haven't hit a concrete value yet, just a dereferencing of some kind.
        //
        const keepGoing = (final, computed) => final.includes("var(--pf") ||
            computed.includes("var(--pf") ||
            computed.includes("$pf-");
        while (keepGoing(finalValue, computedValue)) {
            if (finalValue.includes("var(--pf")) {
                finalValue = getComputedCSSVarValue(finalValue, selector, cssGlobalVariablesMap);
            }
            computedValue = computedValue.includes("var(--pf")
                ? getComputedCSSVarValue(computedValue, selector, cssGlobalsToScssVarsMap)
                : getComputedScssVarValue(computedValue);
            // error out if variable doesn't exist to avoid infinite loop
            if (finalValue === value && computedValue === value) {
                console.error(`Error: "${value}" variable not found`);
                break;
            }
            varsMap.push(computedValue);
        }
        const lastElement = varsMap[varsMap.length - 1];
        if (lastElement.includes("pf-")) {
            varsMap.push(finalValue);
        }
        // all values should not be boxed by var(). We can put them back later.
        return varsMap.map((variable) => variable.replace(/var\(([\w-]*)\)/g, (_, match) => match));
    };
    return getVarsMap;
}
// Given a collection of CSS files, generate a file tokens library of *all* of the tokens within.
export function generateTokens() {
    const cssFiles = globSync(cssFileGlobs, cssFileGlobOpts)
        // Sort to put variables and charts at END of list so getLocalVarsMap returns correct values
        .sort((a, b) => (a.split(path.sep).length < b.split(path.sep).length ? 1 : -1));
    const fileTokens = {};
    const getVarsMap = buildVarsMapGetter(cssFiles);
    cssFiles.forEach((filePath) => {
        const cssAst = parse(readFile(filePath));
        // key is the formatted file name, e.g. c_about_modal_box
        const key = formatFilePathToName(filePath);
        getDeclarations(cssAst).forEach(({ property, value, parent }) => {
            const selector = parent?.selectors?.[0];
            if (!selector) {
                return;
            }
            if (property.startsWith("--pf")) {
                const varsMap = getVarsMap(value, selector);
                const propertyObj = {
                    property,
                    value: varsMap[varsMap.length - 1],
                    values: varsMap.length > 1 ? varsMap : [],
                };
                fileTokens[key] = fileTokens[key] || {};
                fileTokens[key][selector] = fileTokens[key][selector] || {};
                fileTokens[key][selector][property] = propertyObj;
                return;
            }
            fileTokens[key] = fileTokens[key] || {};
            fileTokens[key][selector] = fileTokens[key][selector] || {};
            fileTokens[key][selector][property] = { property, value, values: [] };
        });
    });
    return fileTokens;
}
export default generateTokens;
