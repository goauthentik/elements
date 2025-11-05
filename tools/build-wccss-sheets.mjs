// import fs from "node:fs";
import path from "node:path";
import generateTokens from "./lib/generateTokens.mjs";
import parseCludes from "./lib/cludeRuleParser.mjs";
import yaml from "yaml";
import { checkIsInPackageRoot, readFile, globSrc, SOURCE_DIR,
//    writeFile,
 } from "./utilities.mjs";
// Terminology: A CSS file is made up of Rules. Each Rule has at least on Selector, which is what
// CSS uses to match with HTML components. Each Rule has zero or more Declarations, each of which
// consists of a Property and a Value.
//
// The Transformation file is written in YAML.  It has the fields "import", "output", "base", and "host".
//
// - "import" is a string that corresponds to the CSS filename in Patternfly for a component, such as "icon.css".
// - "output" is the name of the file we'll be writing to in the target folder.
// - "base" is the class Selector associated with the component; in BEM, it's the Block Identifier.
// - "host" is the collection of Transformations.
//
// Each Transformation consists of:
//    "selector":
//        "$from": (optional: string or regexp)
//        "$exclude": (optional: string or regexp)
//        "$include": (optional: string or regexp)
//        "property": "value"
//        "property": "value"
//        ...
//
// The "selector" entry is the Selector for the Rule  will be writing as output.
////
// The "$from" entry specifies which Selector(s) in the source CSS point to the Rules from which
// will be reading Declarations.
//
// The "$include" and "$exclude" entries are a comma-separated list of strings or regular
// expressions, which are used to filter the Declarations by Property. "$include" always takes
// precedence over "$exclude".
//
// All other Property/Value pairs are just plain CSS entries and will be appended to the generated
// Rule(s).
//
// If the "$from" is a regular expression with capture groups, the Selector must have a
// corresponding collection of \1, \2, \3 substitution points for those capture groups.
// The builder will create a new Selector for each Rule in the source that matches the
// regular expression using these substitutions.
//
// My favorite example of this comes from Button, which creates *24* distinct and separate entries
// in the output:
//
// ```
// ':host([variant="\2"][severity="\1"]:\3) #main':
//     "$from": /\.pf-m-(danger|warning)\.pf-m-(primary|secondary|tertiary|link):(hover|focus|active)/
// ```
//
// If the `$from` entry is not present in a Transformation, the presence of Transformation Selector
// substitutions, `$include`, or `$exclude` entries is an error.
//
checkIsInPackageRoot();
const transformationFiles = globSrc("**/*.wcc.yaml");
const componentPrefix = new RegExp("^--pf-v5-c-");
const sourceStylesheet = generateTokens();
// In order to make life easier, for each Block Indentifier in our CSS, we *strip* it from the
// sourceStylesheet's collection of entries, so that our Transformation file doesn't have to
// include it in every entry.  Likewise, the branding prefix "--pf-v5-c-" is stripped from
// all of the internal CSS rules, since they're hidden inside the shadowDOM and don't need
// disambiguating prefixes, making the HTML easier to write.
// Takes every Rule entry of forms:
// {
//    ".pf-v5-c-icon": { <declarations> },
//    ".pf-v5-c-icon.pf-m-inline": { <declarations> }
// }
//
// and returns:
// [
//   ["$base", { <cleanedDeclarations> }]
//   [".pf-m-inline": { <cleanedDeclarations> }]
// ]
//
// We do not bundle the collection of rules back into an object because we will be searching through
// it against a regexp match which may find more than one.
function cleanRules(sourceRules, className) {
    const baseComponentName = className.replace(/^\./, "");
    const baseClassRegex = new RegExp(`^\\.${baseComponentName}`);
    const basePropertyRegex = new RegExp(`--pf-v5-c-`, "g");
    // Takes every Declaration entry of the form:
    // {
    //    "--pf-v5-c-icon--Width": {
    //      "name": "--pf-v5-c-icon--Width",
    //      "value": "0.75rem",
    //      "values": [
    //        "--pf-v5-c-icon--m-sm--Width",
    //        "$pf-v5-global--icon--FontSize--sm",
    //        "0.75rem"
    //      ]
    // },
    //
    // and returns:
    // {
    //    "--pf-v5-c-icon--Width": {
    //      "name": "--pf-v5-c-icon--Width",
    //      "value": "--pf-v5-c-icon--m-sm--Width"
    //    }
    // }
    //
    // If there is no value to dereference, the concrete value in `value:` is returned.
    const cleanDeclarations = (declarations) => Object.fromEntries(Object.entries(declarations).map(([property, entry]) => [
        property.replace(basePropertyRegex, ""),
        {
            name: entry.name.replace(basePropertyRegex, ""),
            value: (entry.values ?? []).length > 0
                ? entry.values[0].replace(basePropertyRegex, "")
                : entry.value,
        },
    ]));
    return Object.entries(sourceRules).map(([selector, declarations]) => [
        selector === className ? "$base" : selector.replace(baseClassRegex, ""),
        cleanDeclarations(declarations),
    ]);
}
// When passed an array of (processed) include/exclude patterns,
// returns a function that will tell you if the Property passed in
// matches any of them.
function createPropertyMatcher(patterns) {
    const stringPatterns = patterns.filter((p) => typeof p === "string");
    const regexPatterns = patterns.filter((p) => p instanceof RegExp);
    return (property) => {
        const trimmedProperty = property.trim();
        return (stringPatterns.includes(trimmedProperty) ||
            regexPatterns.some((regex) => regex.test(trimmedProperty)));
    };
}
// When passed a Transformation, returns a function that will filter Declarations
// by Property based on the include/exclude entry for that Transformation.  `$include`
// takes precendence over `$exclude`, which takes precedence over the identity (just
// returns an unfiltered list.
//
function makeDeclarationFilter(transformation) {
    if ("$include" in transformation) {
        const shouldInclude = createPropertyMatcher(parseCludes(transformation["$include"]));
        return (declarations) => declarations.filter(shouldInclude);
    }
    if ("$exclude" in transformation) {
        const shouldExclude = createPropertyMatcher(parseCludes(transformation["$exclude"]));
        return (declarations) => declarations.filter(shouldExclude);
    }
    return (declarations) => declarations;
}
// `$from`, `$include`, and `$exclude` can all be regular expressions or strings. These help us
// figure out which toolkit to use.  (For `$include` and `$exclude`, this has mostly been taken
// over by the cludeRule parser, but it's still used for `$from`)
//
const matchInstructionIsRegex = (instruction) => instruction[0] === "/" && instruction.at(-1) === "/";
const getMatchInstruction = (instruction) => new RegExp(instruction.substring(1, instruction.length - 1));
// If a selector has substitution rules of the pattern "\1", "\2", etc,
// this function replaces those keys with their values from the
// discovered selectors.
function doSelectorSubstitution(transFrom, transSelector, sourceSelector) {
    const match = transFrom.exec(sourceSelector);
    if (!match) {
        return transSelector;
    }
    let substituted = transSelector;
    match.slice(1).forEach((group, index) => {
        substituted = substituted.replaceAll(`\\${index + 1}`, group);
    });
    return substituted;
}
function tap(a) {
    console.log(a);
    return a;
}
for (const transformationFile of transformationFiles) {
    const transformation = yaml.parse(readFile(path.join(SOURCE_DIR, transformationFile)));
    const componentRules = sourceStylesheet[path.basename(transformation.import)];
    // ".pf-v5-c-component" ->
    const baseComponentClassname = transformation.base;
    // "pf-v5-c-component"
    const baseComponentName = baseComponentClassname.replace(/^\./, "");
    // "--pf-v5-c-component"
    const baseComponentProperty = `--${baseComponentName}`;
    // These are the CSS Custom Properties that go into the `:host` Rule for the component.
    // Each CSS Custom Property is remapped to:
    //
    // --component-name--Property: var(--pf-v5-c-component-name--Property, DefaultValue);
    const hostMapRules = (() => {
        const hostRule = componentRules[transformation.base];
        const hostProperties = Object.keys(hostRule).filter((h) => h.startsWith(baseComponentProperty));
        return hostProperties.map((propertyName) => {
            const property = hostRule[propertyName];
            const { name, value } = property;
            const shortName = name.replace(componentPrefix, "--");
            const hostValue = `var(${name}, ${value})`;
            return { type: "declaration", property: shortName, value: hostValue };
        });
    })();
    // These are the CSS Custom Properties that go into the `:root` Rule for the component.
    // Each CSS Custom Property is remapped to:
    //
    // --pf-v5-c-component-name--Property: var(--pf-v5-global--Property);
    // The purpose of this separation is to ensure that each component's internal Property always
    // has access to its default Value, while allowing the global CSS file to change or redefine
    // those Properties by altering the component's BEMP (Block-Element-Modifier-Property) Value
    // for any given Property.
    const rootMapRules = (() => {
        const hostRule = componentRules[transformation.base];
        const hostProperties = Object.keys(hostRule).filter((h) => h.startsWith(baseComponentProperty));
        return hostProperties
            .map((propertyName) => {
            const property = hostRule[propertyName];
            const { name, value, values } = property;
            if (!(values && values.length > 1)) {
                return { type: "declaration", property: name, value };
            }
            const res = `var(${values[0]})`;
            return { type: "declaration", property: name, value: res };
        })
            .filter((decl) => decl !== null);
    })();
    const rules = [];
    rules.push({
        type: "rule",
        selectors: [":host"],
        declarations: hostMapRules,
    });
    const hostRules = {};
    // For each transformation in the command file:
    //    Using the selector, find every rule in the componentRules collection for which the selector matches precisely.
    //    For each componentRule in the collection that matches precisely,
    //       Perform a selector transformation and create or append to an entry in the return rules collection for it
    //       Perform an include/exclude/append transformation on the declarations in the matching component rule
    const cleanSourceRules = cleanRules(componentRules, transformation.base);
    for (const [transSelector, transRequest] of Object.entries(transformation.host ?? {})) {
        const selectorHasSubstitutions = /\\\d+/.test(transSelector);
        // New rule not derived from the source material.
        if (!("$from" in transRequest)) {
            if (selectorHasSubstitutions ||
                "$include" in transRequest ||
                "$exclude" in transRequest) {
                throw new Error("A rule with no $from may not have substitutions or inclusion rules");
            }
            hostRules[transSelector] = {
                ...(hostRules[transSelector] ?? {}),
                ...transRequest,
            };
            continue;
        }
        const transReqFrom = transRequest["$from"];
        const declarationFilter = makeDeclarationFilter(transRequest);
        // String match on source rule selector, so just build the thing.
        if (!matchInstructionIsRegex(requestedFrom)) {
            if (selectorHasSubstitutions) {
                throw new Error("A selector with substitutions must have a regex '$from'");
            }
            const matchingDeclarations = cleanSourceRules
                .filter(([cleanSelector]) => cleanSelector === requestedFrom)
                .reduce((acc, [cleanSelector, cleanedDeclarations]) => [
                ...acc,
                ...tap(cleanedDeclarations),
            ], []);
            hostRules[selector] = {
                ...(hostRules[selector] ?? {}),
                ...declarationFilter(matchingDeclarations),
            };
            continue;
        }
        const fromMatcher = getMatchInstruction(request["$from"]);
        // For each componentRule in the collection that matches precisely,
        //   Perform a selector transformation and create or append to an entry in the return rules collection for it
        //   Perform an include/exclude/append transformation on the declarations in the matching component rule
        for (const [cleanSourceSelector, cleanSourceDeclarations] of cleanSourceRules) {
            const m = fromMatcher(cleanSourceSelector);
            if (!m) {
                continue;
            }
            const newSelector = selectorSubstitutions(fromMatcher, selector, cleanSourceSelector);
            hostRules[newSelector] = {
                ...(hostRules[newSelector] ?? {}),
                ...declarationFilter(cleanDeclarations),
            };
        }
    }
    console.log(JSON.stringify(hostRules, null, 2));
    stylesheet.rules = [...stylesheet.rules, ...rules];
    //    console.log(JSOaN.stringify(stylesheet, null, 2));
    //    console.log(css.stringify({ stylesheet }));
    roots.push({
        type: "rule",
        selectors: [":root"],
        declarations: rootMapRules,
    });
}
// console.log(
//     css.stringify({
//         stylesheet: {
//             type: "stylesheet",
//             rules: roots,
//         },
//     })
// );
//
