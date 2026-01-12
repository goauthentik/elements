/** @type {import('stylelint').Config} */
export default {
    extends: "stylelint-config-standard",
    plugins: ["stylelint-browser-compat"],
    rules: {
        "plugin/browser-compat": [
            true,
            {
                browserslist: ["baseline widely available"],
            },
        ],
        "custom-property-pattern": [
            "^([a-zA-Z][a-zA-Z0-9]*)([_-]+[a-zA-Z0-9]+)*$",
            {
                message: (name) =>
                    `Expected custom property name "${name}" to follow Patternfly standard`,
            },
        ],
        "selector-class-pattern": [
            "^([a-zA-Z][a-zA-Z0-9]*)([_-]+[a-zA-Z0-9]+)*$",
            {
                message: (name) =>
                    `Expected custom property name "${name}" to follow Patternfly standard`,
            },
        ],
        // These rules re-write parts of Patternfly we want to keep. By collapsing longhand values,
        // Stylelint deprives customizers of the ability to change where the light is coming from
        // for drop shadows.
        "declaration-block-no-redundant-longhand-properties": null,
        "shorthand-property-no-redundant-values": null,

        // This is a problem, but Patternfly does it so often it's not worth the effort to fight it
        // now. This stylelint rule says that a CSS rule with *high* specificity must come before
        // related rules with a lower specificity. While this is harmless in effect, it's a lot
        // harder to understand what the CSS is meant to do when looking at the source code.
        // Unfortunately, Patternfly has a number of places where they violate this, so we need to
        // disable it for now.
        "no-descending-specificity": null,

        // Patternfly sometimes exploits the cascade by arranging duplicate selectors in a way that
        // lets CSS custom properties achieve some interesting and subtle effects. It's ... clever,
        // and not in a good way, but it works, and right now disentangling it is more effort than
        // we want to put in.
        "no-duplicate-selectors": null,
    },
};
