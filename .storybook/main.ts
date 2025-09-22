import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
    stories: ["../dist/**/*.stories.js"],
    staticDirs: ["../static", "../dist"],
    addons: [
        "@storybook/addon-essentials",
        "@chromatic-com/storybook",
        "@storybook/addon-links",
        "@storybook/addon-knobs",
        "@storybook/addon-docs",
    ],
    framework: {
        name: "@storybook/web-components-vite",
    },
    docs: {
        autodocs: "tag",
    },
};

export default config;
