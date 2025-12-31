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
            locators: {
                testIdAttribute: "data-ouia-component-type",
            },
            commands: {
                $: $,
            },
        },
    },
}));
