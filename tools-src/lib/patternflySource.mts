import {
    type ComponentDeclarations,
    type ComponentFiles,
    type ComponentRules,
    type CSSDeclaration,
    getComponentDeclarations,
    getGlobalDeclarations,
    makeReverseLookup,
    type Property,
    type Selector,
    type Value,
} from "./patternflySourceUtils.mjs";

export type {
    ComponentDeclarations,
    ComponentFiles,
    ComponentRules,
    CSSDeclaration,
    Property,
    Selector,
    Value,
};

// WHAT THIS DOES
//
// This code reads in the entire CSS structure for Patternfly 5 and creates a lookup table
// of Component ->* Selectors ->* Declarations -> { property, value, concreteValue? }
// where "concrete value" is the actual value of the a CSS Custom Property after we've
// chased the entire chain of CSS Custom Property references.
//
// WHY THIS EXISTTS
//
// To assist in writing code that diassembles the React-oriented Patternfly 5 repository
// into something more suitable to shadowDOM work.  It provides not just the complete CSS
// in an easily digestible form, but includes values that can be provided as internal
// fallbacks in the shadowDOM portion of the component.
//

// When doing a fuzzy search, clean the key as much as possible. I have the feeling this is hard-won
// knowledge; when even the slightest bit off, the search will die with a found failure.
const sanitizeKey = (key: string) =>
    key
        .replace(/\*$/, "")
        .trim()
        .replace(/>$/, "")
        .trim()
        .replace(/\[.*\]$/, "") // eslint-disable-line sonarjs/slow-regex
        .trim();

const TOMBSTONE = "------------------- not ☠ found ---------------";

export class PatternflySources {
    lightGlobals: Map<Property, CSSDeclaration>;
    darkGlobals: Map<Property, CSSDeclaration>;
    // Standard CSS: Each component has rules indexed by Selector; each Selector has Declarations,
    // indexed by Property; each Declaration then contains a single Value
    //
    // Component ->* Selector ->* Declaration (with complete dereferencing chain for CSS Custom Properties)
    components: ComponentFiles;

    // Any css design system has many Declarations, but each Rule should have only Declarations for
    // which every Property is unique; if it has a requested Property, it has one unique Value.
    // (Note: A "Value" is a CSS atom, but it is not necessarily constructed out of singular values;
    // complex Values like those for animation, border, or shadow shortands, and expression Values
    // using `calc()` may reference multiple other property/value pairs). Given a Property and a
    // Selector, return the Value in that Declaration.
    //
    // Property ->* Selector -> Value
    reverseLookup: Record<Property, Record<Selector, Value>>;

    constructor() {
        [this.lightGlobals, this.darkGlobals] = getGlobalDeclarations();
        this.components = getComponentDeclarations();
        this.reverseLookup = makeReverseLookup(this.components);
        this.populateValueChains();
    }

    // Create a lookup from a property and a selector match, so return the value most closely
    // associated with that property in that selector. This function is rather, ah, *loose* in its
    // interpretation of "closest," but it's the best we can do under the circumstances.
    findConcreteValue(match: string, selector: string): Value | null {
        const propMatch = this.reverseLookup[match as Property];
        if (!propMatch) {
            return null;
        }

        if (propMatch[selector]) {
            return propMatch[selector];
        }

        const entries = Object.entries(propMatch);
        if (entries.length === 1) {
            return entries[0][1];
        }

        let bestMatch = "";
        let bestValue: Value = "" as Value;

        for (const [key] of entries) {
            // remove trailing * from key to compare
            const sanitizedKey = sanitizeKey(key);
            if (selector.indexOf(sanitizedKey) > -1) {
                if (sanitizedKey.length > bestMatch.length) {
                    // longest matching key is the winner
                    bestMatch = key;
                    bestValue = this.reverseLookup[match][key];
                }
            }
        }
        return bestValue;
    }

    getCssValue(value: string, selector: string, dark = false): string | null {
        const found = value.replace(/var\(([\w-]*)(,.*)?\)/g, (full, m1, m2) => {
            if (m1.startsWith("--pf-v5-global")) {
                const global = dark
                    ? (this.darkGlobals.get(m1) ?? this.lightGlobals.get(m1))
                    : this.lightGlobals.get(m1);

                return global ? global.value + (m2 || "") : full;
            }
            if (selector) {
                return this.findConcreteValue(m1, selector) + (m2 || "");
            }
            return TOMBSTONE;
        });
        return found === TOMBSTONE ? null : found;
    }

    // Given the mapping ComponentFile ->* ComponentRules ->* Property -> Value, amend the Value
    // object to have the complete chain of values from initial declaration to final value.

    findFullValueList(value: Value, selector: string) {
        const dark = selector.includes(".pf-v5-theme-dark");
        const found = [value];
        let finalValue = value;

        const keepGoing = (final: string) => final.includes("var(--pf");

        let depth = 0;
        while (keepGoing(finalValue) && depth < 16) {
            depth += 1;
            if (finalValue.includes("var(--pf")) {
                finalValue = this.getCssValue(finalValue, selector, dark) as Value;
            }

            if (finalValue === value) {
                console.error(`Error: "${value}" variable not found`);
                break;
            }

            found.push(finalValue);
        }

        const lastElement = found[found.length - 1];
        if (lastElement.includes("pf-")) {
            found.push(finalValue);
        }

        // all values should not be boxed by var(). We can put them back later.
        return found.map((variable) => variable.replace(/var\(([\w-]*)\)/g, (_, match) => match));
    }

    populateValueChains() {
        for (const [_, componentRules] of Object.entries(this.components)) {
            for (const [selector, declarations] of Object.entries(componentRules)) {
                for (const declaration of Object.values(declarations)) {
                    const { property, value } = declaration;
                    if (property.startsWith("--p")) {
                        const values = this.findFullValueList(value, selector);
                        declaration.value = values[values.length - 1] as Value;
                        declaration.values = values.length > 1 ? values : [];
                    }
                }
            }
        }
    }
}
