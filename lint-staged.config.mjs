/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */

// This syntax ensures that lint-staged doesn't neglect to check *all* of the files, not just the
// ones that changed. TSC was not getting the right list of files to check, so we're falling
// back to TSC's behavior of just checking everything.

export default {
    "*.{js,jsx,mjs,ts,tsx}": () => [
        "npm run lint:types",
        "npm run lint:eslint",
        "npm run prettier",
    ],
    "*.css": ["npm run prettier", "npm run fix:styles"],
    "*.yaml": ["npm run lint:eslint"],
};
