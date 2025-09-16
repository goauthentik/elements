import { DefaultIgnorePatterns } from "@goauthentik/eslint-config";
import { javaScriptConfig } from "@goauthentik/eslint-config/javascript-config";
import { typescriptConfig } from "@goauthentik/eslint-config/typescript-config";

import eslint from "@eslint/js";
import * as litconf from "eslint-plugin-lit";
import sonarjs from "eslint-plugin-sonarjs";
import * as wcconf from "eslint-plugin-wc";
import tseslint from "typescript-eslint";

// @ts-check

export default tseslint.config(
    {
        ignores: DefaultIgnorePatterns,
    },

    eslint.configs.recommended,
    sonarjs.configs.recommended,
    javaScriptConfig,
    wcconf.configs["flat/recommended"],
    litconf.configs["flat/recommended"],
    ...tseslint.configs.recommended,
    ...typescriptConfig,

    {
        rules: {
            "no-console": "off",
        },
        files: [
            // ---
            "**/scripts/**/*",
            "**/test/**/*",
            "**/tests/**/*",
        ],
    },
    {
        rules: {
            "no-void": "off",
            "no-implicit-coercion": "off",
            "prefer-template": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-use-before-define": "off",
            "array-callback-return": "off",
            "block-scoped-var": "off",
            "consistent-return": "off",
            "func-names": "off",
            "guard-for-in": "off",
            "no-bitwise": "off",
            "no-div-regex": "off",
            "no-else-return": "off",
            "no-empty-function": "off",
            "no-param-reassign": "off",
            "no-throw-literal": "off",
            // "no-var": "off",
            "prefer-arrow-callback": "off",
            "vars-on-top": "off",
        },
    },
);
