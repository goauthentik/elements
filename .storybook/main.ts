import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
    stories: ["../dist/**/*.stories.js"],
    staticDirs: ["../static", "../dist"],
    addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
    framework: {
        name: "@storybook/web-components-vite",
    },
    docs: {
        autodocs: "tag",
    },
};

export default config;
