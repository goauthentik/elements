import { StorybookThemeProvider } from "./ak-storybook-theme-provider.component.js";
import { html, TemplateResult } from "lit";

/**
 * @summary Helper function to create a StorybookThemeProvider component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-storybook-theme-provider element
 *
 * @see {@link StorybookThemeProvider} - The underlying web component
 */
export function akStorybookThemeProvider({ content }: { content: TemplateResult }) {
    return html` <ak-storybook-theme-provider>${content}</ak-storybook-theme-provider> `;
}
