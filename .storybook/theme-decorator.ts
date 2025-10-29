import { DecoratorHelpers } from "@storybook/addon-themes";
const { pluckThemeFromContext, initializeThemeState } = DecoratorHelpers;
import "../dist/ak-storybook-theme-provider/ak-storybook-theme-provider.js";
import { html } from "lit";

export function themeDecorator({ themes, defaultTheme, ...rest }) {
    initializeThemeState(Object.keys(themes), defaultTheme);

    return (story, context) => {
        // This is a fetcher for `context.globals["theme"]` 🙄
        const selectedTheme = pluckThemeFromContext(context);
        const { themeOverride } = context.paramaters?.themes ?? {};
        const selected = themeOverride ?? selectedTheme ?? defaultTheme;

        setTimeout(() => {
            document.documentElement.setAttribute("theme", selected);
        }, 0);

        return html`<link rel="stylesheet" href="/css/authentik.css" />
            <ak-storybook-theme-provider>${story()}</ak-storybook-theme-provider>`;
    };
}
