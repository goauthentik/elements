import path from "node:path";

import parseCludes from "./lib/cludeRuleParser.mjs";
import generateTokens, {
    TokenComponents,
    TokenDeclarations,
    TokenRules,
} from "./lib/generateTokens.mjs";
import {
    checkIsInPackageRoot,
    globSrc,
    readFile,
    SOURCE_DIR,
    writeFile,
} from "./lib/utilities.mjs";

// @ts-expect-error no types provided
import authentikPrettierConfig from "@goauthentik/prettier-config";

import css, { Declaration, Rule } from "css";
import * as prettier from "prettier";
import yaml from "yaml";

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

const COMPONENT_PREFIX = new RegExp("^--pf-v5-c-");

const prettierConfig = { ...authentikPrettierConfig, parser: "css" };

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

/**
 * @function cleanRules
 *
 * "Clean" rules are source rules in which any rooting prefixes related to the
 * component's name have been removed.  `.pf-v5-c-component__element`
 * becomes just `__element`, and `--pf-v5-c--BaseColor` becomes `--BaseColor`.
 *
 * We do this because it removes clutter and toil from defining the
 * transformation; transformations are on a per-component basis, and there's
 * no reason for maintainers to have to continually write the component's
 * name over and over in the transformation file.
 */
const varWrap = (s: string) => (/^--[\w-]+/.test(s) ? `var(${s})` : s);

type CleanDeclaration = [string, string];

type CleanRule = [string, CleanDeclaration[]];

function cleanRules(componentRules: TokenRules, className: string): CleanRule[] {
    const cleanDeclarations = (decl: TokenDeclarations, regex: RegExp): CleanDeclaration[] =>
        Object.entries(decl).map(([property, entry]) => [
            property.replace(regex, "--"),
            varWrap(
                (entry.values ?? []).length > 0
                    ? entry.values[0].replaceAll(regex, "--")
                    : entry.value.replaceAll(regex, "--"),
            ),
        ]);

    const componentName = className.replace(/^\./, "");
    const classRegex = new RegExp(`^\\.${componentName}`);
    const propertyRegex = new RegExp(`--pf-v5-c-`, "g");

    return Object.entries(componentRules).map(([selector, declarations]) => [
        selector === className ? "$base" : selector.replace(classRegex, ""),
        cleanDeclarations(declarations, propertyRegex),
    ]);
}

/**
 * @function
 *
 * When passed an array of (parsed) include/exclude patterns, returns a function
 * that will tell you if the Property passed in matches any of them.  This
 * function is used to create filters for including or excluding declarations
 * when copying a source rule's declaration into a built rule
 */
function makePropertyMatcher(patterns: (string | RegExp)[]) {
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
 * from the source Rule by Property based on the include/exclude entry for that
 * Transformation.  `$include` takes precedence over `$exclude`, which takes
 * precedence over the identity (which just returns an unfiltered list).
 */
function makeDeclarationFilter(transformation: Record<string, string>) {
    if ("$include" in transformation) {
        const shouldInclude = makePropertyMatcher(parseCludes(transformation.$include));
        return (declarations: CleanDeclaration[]) =>
            declarations.filter((d) => shouldInclude(d[0]));
    }
    if ("$exclude" in transformation) {
        const shouldExclude = makePropertyMatcher(parseCludes(transformation.$exclude));
        return (declarations: CleanDeclaration[]) =>
            declarations.filter((d) => !shouldExclude(d[0]));
    }
    return (declarations: CleanDeclaration[]) => declarations;
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

function makeSelectorMatcher(from: string) {
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
function doSelectorSubstitution(from: RegExp, transSelector: string, sourceSelector: string) {
    const match = from.exec(sourceSelector);
    if (!match) {
        return transSelector;
    }

    let substituted = transSelector;
    match.slice(1).forEach((group, index) => {
        substituted = substituted.replaceAll(`\\${index + 1}`, group);
    });

    return substituted;
}

/**
 * Convert our internal formats to those use by Rework/CSS's stringifier.  In the
 * end, that's what we construct and emit, using their verifier to ensure we're
 * not writing out a broken CSS file.
 */

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

/**
 * @function
 *
 * Extracts declarations from the Transformation that aren't imported via
 * `$include` or `$exclude`
 */
const getCustomDeclarations = (declarations: Record<string, string>): HardDeclaration[] =>
    Object.entries(declarations)
        .filter(([property]) => !property.startsWith("$"))
        .map(([property, value]) => makeDeclaration(property, value));

/**
 * @class
 *
 * Manages the built rules and their declarations collection.  Mostly, this was
 * just to avoid some weirdness around using closures in the big
 * buildStylesheet() function.
 */
class HostRules {
    hostRules: HardRule[];

    constructor(hostRules: HardRule[] = []) {
        this.hostRules = hostRules;
    }

    add(rule: HardRule) {
        const foundRule = this.hostRules.find(
            (r: HardRule) => r.selectors.at(0) === rule.selectors.at(0),
        );
        if (!foundRule) {
            this.hostRules.push(rule);
            return;
        }
        foundRule.declarations = [...foundRule.declarations, ...rule.declarations];
    }

    get rules() {
        return this.hostRules;
    }
}

/**
 * @function
 *
 * The CSS Custom Properties that ultimately go into the `:host` or `:root` declarations are
 * handled separately.  We haven't found a case where they aren't definitive on their own,
 * without custom processing.
 *
 */
type GetHostRulesReturn = {
    hostRules: HostRules;
    rootRules: HostRules;
};

function getHostRules(sourceDeclarations: TokenDeclarations, base: string): GetHostRulesReturn {
    const hostDeclarations = Object.keys(sourceDeclarations).filter((h) => h.startsWith(base));

    const foundHostDeclarations = hostDeclarations.map((declarationName: string) => {
        const { property, value } = sourceDeclarations[declarationName];
        const shortName = property.replace(COMPONENT_PREFIX, "--");
        const hostValue = `var(${property}, ${value})`;
        return makeDeclaration(shortName, hostValue);
    });

    const foundRootDeclarations = hostDeclarations
        .map((declarationName: string) => {
            const declaration = sourceDeclarations[declarationName];
            const { property, value, values } = declaration;
            return makeDeclaration(
                property,
                !(values && values.length > 1) ? value : `var(${values[0]})`,
            );
        })
        .filter((declaration) => declaration !== null);

    return {
        hostRules: new HostRules([makeRule(":host", foundHostDeclarations)]),
        rootRules: new HostRules([makeRule(":root", foundRootDeclarations)]),
    };
}

/**
 * @function
 *
 * If we get a transformation with no $from, we have to check that it has no
 * features that might hint that it should.
 */
const derivedFromTokens = (hasSubstitutions: boolean, request: Record<string, string>) =>
    hasSubstitutions || ["$include", "$exclude"].some((key) => key in request);

/**
 * Named types for parameters of the function following
 */
type DeclarationFilter = ReturnType<typeof makeDeclarationFilter>;

type ComponentMatcher = ReturnType<typeof makeSelectorMatcher>;

/**
 * @function
 *
 * Used when there's a `$from` clause, but no substitutions.  In that case, the
 * selector doesn't need to be transformed, only the declarations, so we
 * extract those here and return them preprocessed and ready to be incorporated
 * into the built rule.
 */
function getComponentDeclarations(
    cleanRules: CleanRule[],
    componentMatcher: ComponentMatcher,
    declarationFilter: DeclarationFilter,
) {
    const matchingRules = cleanRules.filter(([cleanSelector]) => componentMatcher(cleanSelector));

    const allMatchingDeclarations: CleanDeclaration[] = matchingRules.flatMap(
        ([_cleanRules, cleanDeclarations]) => cleanDeclarations,
    );

    return declarationFilter(allMatchingDeclarations).map((declaration) =>
        makeDeclaration(...declaration),
    );
}

type SubstitutedRule = [string, HardDeclaration[]];

/**
 * @function
 *
 * Used when there's a `$from` clause and substitutions are required.  This inverts
 * the process of the "no substitutions" algorithms; it generates a collection of
 * rules in a [selector, declarations] format, and then relies on the HostRules
 * merge algorithm to merge them all together at the end.
 */
function buildSubstitutedRules(
    from: string,
    cleanRules: CleanRule[],
    componentMatcher: ComponentMatcher,
    transSelector: string,
    declarationFilter: DeclarationFilter,
): SubstitutedRule[] {
    const transformationRegex = makeAnchoredRegexp(from);
    return cleanRules
        .filter(([cleanSelector]) => componentMatcher(cleanSelector))
        .map(([cleanSelector, cleanDeclarations]) => {
            const newSelector = doSelectorSubstitution(
                transformationRegex,
                transSelector,
                cleanSelector,
            );

            const includedCleanDeclarations = declarationFilter(cleanDeclarations);
            const includedDeclarations: HardDeclaration[] = includedCleanDeclarations.map(
                (declaration) => makeDeclaration(...declaration),
            );

            return [newSelector, includedDeclarations];
        });
}

async function buildStylesheets(transformationFiles: string[]) {
    const sourceStylesheet: TokenComponents = generateTokens();

    for (const transformationFile of transformationFiles) {
        const transformation: WccssInstructions = yaml.parse(
            readFile(path.join(SOURCE_DIR, transformationFile)),
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
            baseComponentProperty,
        );

        const cleanSourceRules = cleanRules(componentRules, transformation.base);

        // For each transformation in the command file:
        //   - Using the selector, find every rule in the componentRules
        //     collection for which the selector matches precisely.
        //   - For each componentRule in the collection that matches
        //     precisely
        //     - Perform a selector transformation and create or append to an
        //       entry in the return rules collection for it
        //     - Perform an include/exclude/append transformation on the
        //       declarations in the matching component rule

        const transformationsToPerform = Object.entries(transformation.host ?? {});

        transrule: for (const [rawTransSelector, transRequest] of transformationsToPerform) {
            const transSelector = rawTransSelector.replace(/%\d+$/, "");
            const selectorHasSubstitutions = /\\\d+/.test(transSelector);
            const customDeclarations = getCustomDeclarations(transRequest);

            // New rule not derived from the source material.
            if (!("$from" in transRequest)) {
                if (derivedFromTokens(selectorHasSubstitutions, transRequest)) {
                    throw new Error(
                        `${transSelector} rule has no $from and may not have substitutions or inclusion rules`,
                    );
                }
                hostRules.add(makeRule(transSelector, customDeclarations));
                continue transrule;
            }

            const componentMatcher = makeSelectorMatcher(transRequest.$from);
            const declarationFilter = makeDeclarationFilter(transRequest);

            // New rule derived from a single selector;
            if (!selectorHasSubstitutions) {
                const foundDeclarations = getComponentDeclarations(
                    cleanSourceRules,
                    componentMatcher,
                    declarationFilter,
                );
                hostRules.add(
                    makeRule(transSelector, [...foundDeclarations, ...customDeclarations]),
                );
                continue;
            }

            buildSubstitutedRules(
                transRequest.$from,
                cleanSourceRules,
                componentMatcher,
                transSelector,
                declarationFilter,
            ).forEach(([newSelector, newDeclarations]) =>
                hostRules.add(makeRule(newSelector, [...newDeclarations, ...customDeclarations])),
            );
        }

        const newHostPath = path.join(
            SOURCE_DIR,
            transformationFile.replace(/\.wcc\.\w+$/, ".css"),
        );

        const hostContent = await prettier.format(
            css.stringify({
                type: "stylesheet",
                stylesheet: {
                    rules: hostRules.rules,
                },
            }),
            prettierConfig,
        );

        writeFile(newHostPath, hostContent);

        const newRootPath = path.join(
            SOURCE_DIR,
            transformationFile.replace(/\.wcc\.\w+$/, ".root.css"),
        );

        const rootContent = await prettier.format(
            css.stringify({
                type: "stylesheet",
                stylesheet: {
                    rules: rootRules.rules,
                },
            }),
            prettierConfig,
        );

        writeFile(newRootPath, rootContent);
    }
}

const transformationFiles: string[] = globSrc("**/*.wcc.yaml");
await buildStylesheets(transformationFiles);
