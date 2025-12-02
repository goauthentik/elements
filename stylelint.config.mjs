/** @type {import('stylelint').Config} */
export default {
    extends: "stylelint-config-standard",
    rules: {
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
        // These is bad, but Patternfly does it so often it's not worth the effort to
        // fight it now.
        "no-descending-specificity": null,
        "no-duplicate-selectors": null,

        // "custom-property-empty-line-before": null,
        // "declaration-empty-line-before": null,
        // "declaration-block-no-redundant-longhand-properties": null,
    },
};
