import "../dist/css/authentik.css";
import "../dist/css/patternfly.css";
import "../dist/ak-storybook-theme-provider/ak-storybook-theme-provider.js";
import { themeDecorator } from "./theme-decorator.js";

import customElements from "../custom-elements.json";

import type { Preview } from "@storybook/web-components";
import { setCustomElementsManifest } from "@storybook/web-components";

import { html } from "lit";

setCustomElementsManifest(customElements);

const preview: Preview = {
    decorators: [
        themeDecorator({
            themes: { light: "light", dark: "dark" },
            defaultTheme: "light",
        }),
    ],

    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
