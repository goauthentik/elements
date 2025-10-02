import "../dist/css/authentik.css";
import "../dist/css/patternfly.css";

import customElements from "../custom-elements.json";

import type { Preview } from "@storybook/web-components";
import { setCustomElementsManifest } from "@storybook/web-components";

import { html } from "lit";

setCustomElementsManifest(customElements);

const preview: Preview = {
    decorators: [(story) => html`<link rel="stylesheet" href="/css/authentik.css" />${story()}`],

    parameters: {
        controls: {
            expanded: true,
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
