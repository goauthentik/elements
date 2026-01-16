import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

const $ = ({ page, provider }, selector) => {
    if (provider.name !== "playwright") {
        throw new Error(`Provider "${provider.name}" is not supported`);
    }
    return page.locator(selector);
};

export default defineConfig(({ mode }) => ({
    optimizeDeps: {
        include: [
            "@open-wc/lit-helpers",
            "vitest-browser-lit",
            "@lit/localize",
            "lit",
            "date-fns",
            "lit/directives/if-defined.js",
            "lit/decorators/property.js",
            "lit/decorators.js",
            "@patternfly/pfe-core/controllers/internals-controller.js",
            "@patternfly/pfe-core/decorators/observed.js",
            "ts-pattern",
        ],
    },
    test: {
        alias: {
            "@goauthentik/elements": resolve(__dirname, "./dist"),
        },
        dir: "./dist",
        include: ["**/*.test.js"],
        browser: {
            enabled: true,
            instances: [{ browser: "chromium" }],
            provider: playwright(),
            headless: "CI" in process.env,
            locators: {
                testIdAttribute: "data-ouia-component-type",
            },
            commands: {
                $: $,
            },
        },
        css: {
            include: true,
        },
        setupFiles: ["./config/vitest.setup.js"],
        reporters: process.env.GITHUB_ACTIONS ? ["github-actions", "default"] : ["default"],
    },
}));
