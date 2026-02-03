import { createRequire } from "node:module";
import path from "node:path";

import { readFile } from "./utilities.mjs";

import { Declaration, Node, parse, Rule } from "css";
import { globSync } from "glob";

const require = createRequire(import.meta.url);

type Component = string; // Brand<string, "path">;
export type Selector = string; // Brand<string, "selector">;
export type Property = string; // Brand<string, "property">;
export type Value = string; // Brand<string, "value">;

export type CSSDeclaration = Omit<Declaration, "property" | "value"> & {
    property: Property;
    value: Value;
    values: string[];
    selector: Selector;
    dark: boolean;
};

// Declarations, indexed by property name.
export type ComponentDeclarations = Record<Property, CSSDeclaration>;

// ComponentName -> Selector and their Declarations
export type ComponentRules = Record<Selector, ComponentDeclarations>;

export type ComponentFiles = Record<Component, ComponentRules>;

export const isDeclaration = (v: Node): v is CSSDeclaration =>
    isCssType(v, "declaration") &&
    "property" in v &&
    "value" in v &&
    typeof v.property === "string" &&
    typeof v.value === "string";

const isObj = (v: any): boolean => typeof v === "object" && v !== null;

// eslint-disable @typescript-eslint/no-explicit-any
const isCssObj = (v: any): boolean => isObj(v) && "type" in v;

// eslint-disable @typescript-eslint/no-explicit-any
const isCssType = (v: any, t: string): boolean => isCssObj(v) && v.type === t;

const isRule = (node: Node): node is Rule => isCssType(node, "rule");

const getCss = (path: string) => parse(readFile(require.resolve(path)));

const lightSelectorName = ":where(:root)" as Selector;

const darkSelectorName = ":where(.pf-v5-theme-dark)" as Selector;

const isLightGlobalSelector = (node: Node) =>
    isRule(node) && (node.selectors ?? []).includes(lightSelectorName);

const isDarkGlobalSelector = (node: Node) =>
    isRule(node) && (node.selectors ?? []).includes(darkSelectorName);

// Read the Patternfly 5 bases defined on `:root` and `:root([dark-mode])`

export function getGlobalDeclarations() {
    const css = getCss("@patternfly/patternfly/base/patternfly-variables.css");
    const rules = css?.stylesheet?.rules;
    if (!rules) {
        throw new Error("Was unable to load patternfly-variables");
    }

    const lightRule = rules.find(isLightGlobalSelector);
    const darkRule = rules.find(isDarkGlobalSelector);
    if (!(lightRule && isRule(lightRule)) || !(darkRule && isRule(darkRule))) {
        throw new Error(
            "Could not find the light global rule or dark global rule. Please check your sources",
        );
    }

    // prettier-ignore
    const getDeclarations = (rule: Rule, selector: Selector, dark: boolean): Map<Property, CSSDeclaration> =>  
        new Map((rule?.declarations ?? [])
            .filter((d) => isDeclaration(d))
            .map((d) => [d.property, ({ ...d, values: [], selector, dark })]));

    return [
        getDeclarations(lightRule, lightSelectorName, false),
        getDeclarations(darkRule, darkSelectorName, true),
    ];
}

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

const processDeclarations = (declarations: CSSDeclaration[], selector: Selector) =>
    Object.fromEntries(
        (declarations ?? [])
            .filter((d) => isDeclaration(d))
            .map((d) => [
                d.property,
                {
                    ...d,
                    values: [],
                    selector,
                    dark: selector.includes(".pf-v5-theme-dark"),
                },
            ]),
    );

// For every file, create the map:
// ComponentFile ->* ComponentRules ->* Property -> Value
export function getComponentDeclarations() {
    const cssFiles = globSync(cssFileGlobs, cssFileGlobOpts)
        // Sort to put variables and charts at END of list so our lookups return correct values. It
        // is a fragile coincidence that this works, but... it does work. So far.
        .sort((a: string, b: string) =>
            a.split(path.sep).length < b.split(path.sep).length ? 1 : -1,
        );

    const componentFiles: ComponentFiles = {};

    for (const cssFilePath of cssFiles) {
        const cssAst = parse(readFile(cssFilePath));
        const rules = cssAst?.stylesheet?.rules;
        if (!rules) {
            throw new Error(`Was unable to load ${cssFilePath}`);
        }

        const componentFileName = path.basename(cssFilePath) as Component;
        const validRules = rules
            .filter((node) => isRule(node))
            .filter((rule) => (rule.selectors ?? []).length > 0);

        const componentRules: ComponentRules = {};
        for (const rule of validRules) {
            const selector = (rule.selectors ?? [])[0];
            componentRules[selector] = processDeclarations(
                (rule.declarations ?? []).filter(isDeclaration),
                selector,
            );
        }
        componentFiles[componentFileName] = componentRules;
    }

    return componentFiles;
}

// Given the map: ComponentFile ->* ComponentRules ->* Property -> Value,
// Add the values chain to the Value object.
export function makeReverseLookup(components: ComponentFiles) {
    const lookups: Record<Property, Record<Selector, Value>> = {};
    const rules = Object.values(components);
    for (const rule of rules) {
        for (const [selector, compdecls] of Object.entries(rule)) {
            const declarations = Object.values(compdecls);
            for (const { property, value } of declarations) {
                lookups[property] = {
                    ...lookups[property],
                    [selector]: value,
                };
            }
        }
    }
    return lookups;
}
