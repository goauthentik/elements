import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
    stories: ["../dist/**/*.stories.js"],
    staticDirs: ["../static", "../dist"],
    addons: [
        "@storybook/addon-a11y",
        "@wc-toolkit/storybook-helpers",
        "@storybook/addon-docs",
        "@storybook/addon-themes",
    ],
    framework: {
        name: "@storybook/web-components-vite",
    },
    docs: {
        autodocs: "tag",
    },
};

export default config;
