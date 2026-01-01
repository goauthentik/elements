import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

const $ = ({ page, provider }, selector) => {
    if (provider.name !== "playwright") {
        throw new Error(`provider ${provider.name} is not supported`);
    }
    return page.locator(selector);
};

export default defineConfig(({ mode }) => ({
    optimizeDeps: {
        include: [
            "@open-wc/lit-helpers",
            "vitest-browser-lit",
            "lit",
            "lit/directives/if-defined.js",
            "lit/decorators.js",
            "@patternfly/pfe-core/controllers/internals-controller.js",
            "ts-pattern",
            "lit/decorators/property.js",
        ],
    },
    test: {
        alias: {
            "@goauthentik/elements": path.resolve(__dirname, "./dist"),
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
    },
}));
