/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */

export default {
    "*.{js,jsx,mjs,ts,tsx}": () => [
        "npm run lint:types",
        "npm run lint:eslint",
        "npm run prettier",
    ],
    "*.css": ["npm run prettier", "npm run fix:styles"],
    "*.yaml": ["npm run lint:eslint"],
};
