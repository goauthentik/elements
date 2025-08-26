/// <reference types="@wdio/globals/types" />
/**
 * @file WebdriverIO configuration file
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const runHeadless = !!process.env.CI;

/**
 * @type {WebdriverIO.Capabilities[]}
 */
const capabilities = [
    {
        "browserName": "chrome", // or "firefox", "microsoftedge", "safari"
        "goog:chromeOptions": {
            args: [
                "--disable-search-engine-choice-screen",
                "--disable-gpu",
                ...(runHeadless
                    ? [
                          "--headless",
                          "--no-sandbox",
                          "--window-size=1280,672",
                          "--disable-infobars",
                          "--disable-extensions",
                          "--disable-dev-shm-usage",
                      ]
                    : []),
            ],
        },
    },
];

/**
 * @type {WebdriverIO.BrowserRunnerOptions}
 */
const browserRunnerOptions = {};

export const config = {
    runner: ["browser", browserRunnerOptions],

    specs: [path.resolve(__dirname, "..", "dist", "**", "*.test.js")],
    exclude: [],
    maxInstances: 1,
    capabilities,

    logLevel: "warn",

    deprecationWarnings: true,
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: "mocha",

    reporters: ["spec"],

    mochaOpts: {
        ui: "bdd",
        timeout: 60000,
    },
};
