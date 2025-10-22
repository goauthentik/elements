import { akStorybookThemeProvider } from "./ak-storybook-theme-provider.builder.js";

import { StorybookThemeProvider } from "./ak-storybook-theme-provider.component.js";

export { akStorybookThemeProvider, StorybookThemeProvider };

window.customElements.define("ak-storybook-theme-provider", StorybookThemeProvider);

declare global {
    interface HTMLElementTagNameMap {
        "ak-storybook-theme-provider": StorybookThemeProvider;
    }
}
