// import fs from "node:fs";
import path from "node:path";
import generateTokens, {
    TokenComponents,
    TokenRules,
    TokenDeclarations,
} from "./lib/generateTokens.mjs";
import parseCludes from "./lib/cludeRuleParser.mjs";
import yaml from "yaml";
import {
    checkIsInPackageRoot,
    readFile,
    writeFile,
    globSrc,
    SOURCE_DIR,
    //    writeFile,
} from "./lib/utilities.mjs";
import css, { Declaration, Rule, Stylesheet } from "css";

type WccssInstructions = {
    import: string;
    output: string;
    base: string;
    host: Record<string, Record<string, string>>;
};

type HardDeclaration = Required<Pick<Declaration, "type" | "property" | "value">>;
type HardRule = Required<Pick<Rule, "type" | "selectors">> & { declarations: HardDeclaration[] };

/*
 * Terminology: A CSS file is made up of Rules. Each Rule has at least on Selector, which is what
 * CSS uses to match with HTML components. Each Rule has zero or more Declarations, each of which
 * consists of a Property and a Value.
 *
 * The Transformation file is written in YAML.  It has the fields "import", "output", "base", and "host".
 *
 * - "import" is a string that corresponds to the CSS filename in Patternfly for a component, such as "icon.css".
 * - "output" is the name of the file we'll be writing to in the target folder.
 * - "base" is the class Selector associated with the component; in BEM, it's the Block Identifier.
 * - "host" is the collection of Transformations.
 *
 * Each Transformation consists of:
 *    "selector":
 *        "$from": (optional: string or regexp)
 *        "$exclude": (optional: string or regexp)
 *        "$include": (optional: string or regexp)
 *        "property": "value"
 *        "property": "value"
 *        ...
 *
 * The "selector" entry is the Selector for the Rule  will be writing as output.
 *
 * The "$from" entry specifies which Selector(s) in the source CSS point to the Rules from which
 * will be reading Declarations.
 *
 * The "$include" and "$exclude" entries are a comma-separated list of strings or regular
 * expressions, which are used to filter the Declarations by Property. "$include" always takes
 * precedence over "$exclude".
 *
 * All other Property/Value pairs are just plain CSS entries and will be appended to the generated
 * Rule(s).
 *
 * If the "$from" is a regular expression with capture groups, the Selector must have a
 * corresponding collection of \1, \2, \3 substitution points for those capture groups.
 * The builder will create a new Selector for each Rule in the source that matches the
 * regular expression using these substitutions.
 *
 * My favorite example of this comes from Button, which creates *24* distinct and separate entries
 * in the output:
 *
 * ```
 * ':host([variant="\2"][severity="\1"]:\3) #main':
 *     "$from": /\.pf-m-(danger|warning)\.pf-m-(primary|secondary|tertiary|link):(hover|focus|active)/
 * ```
 *
 * If the `$from` entry is not present in a Transformation, the presence of Transformation Selector
 * substitutions, `$include`, or `$exclude` entries is an error.
 *
 */

checkIsInPackageRoot();

const componentPrefix = new RegExp("^--pf-v5-c-");

const sourceStylesheet: TokenComponents = generateTokens();

/*
 * In order to make life easier, for each Block Indentifier in our CSS, we *strip* it from the
 * sourceStylesheet's collection of entries, so that our Transformation file doesn't have to
 * include it in every entry.  Likewise, the branding prefix "--pf-v5-c-" is stripped from
 * all of the internal CSS rules, since they're hidden inside the shadowDOM and don't need
 * disambiguating prefixes, making the HTML easier to write.
 * Takes every Rule entry of forms:
 * {
 *    ".pf-v5-c-icon": { <declarations> },
 *    ".pf-v5-c-icon.pf-m-inline": { <declarations> }
 * }
 *
 * and returns:
 * [
 *   ["$base", { <cleanedDeclarations> }]
 *   [".pf-m-inline": { <cleanedDeclarations> }]
 * ]
 *
 * We do not bundle the collection of rules back into an object because we will be searching through
 * it against a regexp match which may find more than one.
 */

type CleanedDeclaration = [string, string];

type CleanedRule = [string, CleanedDeclaration[]];

const varWrap = (s: string) => (/^--[\w-]+/.test(s) ? `var(${s})` : s);

/**
 * @function
 *
 * Returns a rule's declarations in the form:
 * ["-icon--Width", "--icon--m-sm--Width"]
 * ["width": "--icon--Width"]
 */
const makeCleanDeclarations = (
    declarations: TokenDeclarations,
    baseRegex: RegExp
): CleanedDeclaration[] =>
    Object.entries(declarations).map(([property, entry]) => [
        property.replace(baseRegex, "--"),
        varWrap(
            (entry.values ?? []).length > 0
                ? entry.values[0].replaceAll(baseRegex, "--")
                : entry.value.replaceAll(baseRegex, "--")
        ),
    ]);

function cleanRules(sourceRules: TokenRules, className: string): CleanedRule[] {
    const baseComponentName = className.replace(/^\./, "");

    const baseClassRegex = new RegExp(`^\\.${baseComponentName}`);

    const basePropertyRegex = new RegExp(`--pf-v5-c-`, "g");

    return Object.entries(sourceRules).map(([selector, declarations]) => [
        selector === className ? "$base" : selector.replace(baseClassRegex, ""),
        makeCleanDeclarations(declarations, basePropertyRegex),
    ]);
}

/**
 * @function
 *
 * When passed an array of (parsed) include/exclude patterns,
 * returns a function that will tell you if the Property passed in
 * matches any of them.
 */
function createPropertyMatcher(patterns: (string | RegExp)[]) {
    const stringPatterns = patterns.filter((p) => typeof p === "string");
    const regexPatterns = patterns.filter((p) => p instanceof RegExp);
    return (property: string) => {
        const trimmedProperty = property.trim();
        return (
            stringPatterns.includes(trimmedProperty) ||
            regexPatterns.some((regex) => regex.test(trimmedProperty))
        );
    };
}

/**
 * @function
 *
 * When passed a Transformation, returns a function that will filter Declarations
 * by Property based on the include/exclude entry for that Transformation.  `$include`
 * takes precedence over `$exclude`, which takes precedence over the identity (which just
 * returns an unfiltered list).
 */
function makeDeclarationFilter(transformation: Record<string, string>) {
    if ("$include" in transformation) {
        const shouldInclude = createPropertyMatcher(parseCludes(transformation.$include));
        return (declarations: CleanedDeclaration[]) =>
            declarations.filter((d) => shouldInclude(d[0]));
    }
    if ("$exclude" in transformation) {
        const shouldExclude = createPropertyMatcher(parseCludes(transformation.$exclude));
        return (declarations: CleanedDeclaration[]) =>
            declarations.filter((d) => !shouldExclude(d[0]));
    }
    return (declarations: CleanedDeclaration[]) => declarations;
}

/**
 * @function
 *
 * `$from`, `$include`, and `$exclude` can all be regular expressions or strings. These help us
 * figure out which toolkit to use.  (For `$include` and `$exclude`, this has mostly been taken
 * over by the cludeRule parser, but it's still used for `$from`)
 */
const matchInstructionIsRegex = (instruction: string) =>
    instruction[0] === "/" && instruction.at(-1) === "/";

const extractRegexpInside = (instruction: string) =>
    instruction.substring(1, instruction.length - 1);

const makeRegexp = (instruction: string) => new RegExp(extractRegexpInside(instruction));

const makeAnchoredRegexp = (instruction: string) =>
    new RegExp("^" + extractRegexpInside(instruction) + "$");

function getSelectorMatcher(from: string) {
    if (matchInstructionIsRegex(from)) {
        const comparison = makeAnchoredRegexp(from);
        return (s: string) => comparison.test(s);
    }
    return (s: string) => s === from;
}

/**
 * @function
 *
 * If a selector has substitution rules of the pattern "\1", "\2", etc,
 * this function replaces those keys with their values from the
 * discovered selectors.
 */
function doSelectorSubstitution(transFrom: RegExp, transSelector: string, sourceSelector: string) {
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

// A useful debugging function.
export function tap<A>(a: A): A {
    console.debug(a);
    return a;
}

const makeRule = (selector: string, declarations: HardDeclaration[]): HardRule => ({
    type: "rule",
    selectors: [selector],
    declarations,
});

const makeDeclaration = (property: string, value: string): HardDeclaration => ({
    type: "declaration",
    property,
    value,
});

// Extracts the Declarations that go into a component's `:host` Rule.
function getHostRules(allDeclarations: TokenDeclarations, base: string) {
    const hostDeclarations = Object.keys(allDeclarations).filter((h) => h.startsWith(base));

    const foundHostDeclarations = hostDeclarations.map((declarationName: string) => {
        const { property, value } = allDeclarations[declarationName];
        const shortName = property.replace(componentPrefix, "--");
        const hostValue = `var(${property}, ${value})`;
        return makeDeclaration(shortName, hostValue);
    });

    const foundRootDeclarations = hostDeclarations
        .map((declarationName: string) => {
            const declaration = allDeclarations[declarationName];
            const { property, value, values } = declaration;
            return makeDeclaration(
                property,
                !(values && values.length > 1) ? value : `var(${values[0]})`
            );
        })
        .filter((declaration) => declaration !== null);

    return {
        hostRules: [makeRule(":host", foundHostDeclarations)],
        rootRules: [makeRule(":root", foundRootDeclarations)],
    };
}

const getStandardDeclarations = (declarations: Record<string, string>): HardDeclaration[] =>
    Object.entries(declarations)
        .filter(([property]) => !property.startsWith("$"))
        .map(([property, value]) => makeDeclaration(property, value));

function buildStylesheets(transformationFiles: string[]) {
    for (const transformationFile of transformationFiles) {
        console.log(transformationFile);
        const transformation: WccssInstructions = yaml.parse(
            readFile(path.join(SOURCE_DIR, transformationFile))
        );

        const componentRules: TokenRules = sourceStylesheet[path.basename(transformation.import)];

        // ".pf-v5-c-component"
        const baseComponentClassname = transformation.base;

        // "pf-v5-c-component"
        const baseComponentName = baseComponentClassname.replace(/^\./, "");

        // "--pf-v5-c-component"
        const baseComponentProperty = `--${baseComponentName}`;

        // The purpose of this separation is to ensure that each component's internal Property
        // always has access to its default Value, while allowing the global CSS file to change or
        // redefine those Properties by altering the component's BEMP
        // (Block-Element-Modifier-Property) Value for any given Property.

        const { rootRules, hostRules } = getHostRules(
            componentRules[transformation.base],
            baseComponentProperty
        );

        const addHostRule = (rule: HardRule) => {
            const foundRule = hostRules.find(
                (r: HardRule) => r.selectors.at(0) === rule.selectors.at(0)
            );
            if (!foundRule) {
                hostRules.push(rule);
                return;
            }
            foundRule.declarations = [...foundRule.declarations, ...rule.declarations];
        };

        const cleanSourceRules = cleanRules(componentRules, transformation.base);

        // For each transformation in the command file:
        //    Using the selector, find every rule in the componentRules collection for which the selector matches precisely.
        //    For each componentRule in the collection that matches precisely,
        //       Perform a selector transformation and create or append to an entry in the return rules collection for it
        //       Perform an include/exclude/append transformation on the declarations in the matching component rule

        const transformationsToPerform = Object.entries(transformation.host ?? {});

        transrule: for (const [transSelector, transRequest] of transformationsToPerform) {
            const selectorHasSubstitutions = /\\\d+/.test(transSelector);

            // New rule not derived from the source material.
            if (!("$from" in transRequest)) {
                if (
                    selectorHasSubstitutions ||
                    "$include" in transRequest ||
                    "$exclude" in transRequest
                ) {
                    throw new Error(
                        "A rule with no $from may not have substitutions or inclusion rules"
                    );
                }

                addHostRule(makeRule(transSelector, getStandardDeclarations(transRequest)));
                continue transrule;
            }

            const fromMatcher = getSelectorMatcher(transRequest.$from);

            const declarationFilter = makeDeclarationFilter(transRequest);

            // New rule derived from a single selector;
            if (!selectorHasSubstitutions) {
                const matchingRules = cleanSourceRules.filter(([cleanSelector]) =>
                    fromMatcher(cleanSelector)
                );

                const allMatchingDeclarations: CleanedDeclaration[] = matchingRules.flatMap(
                    ([_cleanRules, cleanDeclarations]) => cleanDeclarations
                );

                const includedCleanDeclarations = declarationFilter(allMatchingDeclarations);
                const includedDeclarations = includedCleanDeclarations.map((declaration) =>
                    makeDeclaration(...declaration)
                );

                addHostRule(makeRule(transSelector, includedDeclarations));

                continue transrule;
            }

            // Multiple rules derived from selector matching

            {
                const transformationRegex = makeAnchoredRegexp(transRequest.$from);

                multirule: for (const [cleanSelector, cleanDeclarations] of cleanSourceRules) {
                    const m = fromMatcher(cleanSelector);
                    if (!m) {
                        continue multirule;
                    }

                    const newSelector = doSelectorSubstitution(
                        transformationRegex,
                        transSelector,
                        cleanSelector
                    );

                    const includedCleanDeclarations = declarationFilter(cleanDeclarations);
                    const includedDeclarations = includedCleanDeclarations.map((declaration) =>
                        makeDeclaration(...declaration)
                    );
                    addHostRule(makeRule(newSelector, includedDeclarations));
                }
            }
        }

        const newHostPath = path.join(
            SOURCE_DIR,
            transformationFile.replace(/\.wcc\.\w+$/, ".css")
        );

        writeFile(
            newHostPath,
            css.stringify({
                type: "stylesheet",
                stylesheet: {
                    rules: hostRules,
                },
            })
        );

        const newRootPath = path.join(
            SOURCE_DIR,
            transformationFile.replace(/\.wcc\.\w+$/, ".root.css")
        );

        writeFile(
            newRootPath,
            css.stringify({
                type: "stylesheet",
                stylesheet: {
                    rules: rootRules,
                },
            })
        );
    }
}

const transformationFiles: string[] = globSrc("**/*.wcc.yaml");
buildStylesheets(transformationFiles);
