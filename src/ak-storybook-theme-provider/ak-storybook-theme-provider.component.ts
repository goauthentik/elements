import { LitElement, css, html } from "lit";
import { ThemeProvider } from "../controllers/themeContextProvider.js";
/**
 * @summary A very simple empty element to activate the theme provider.
 *
 * DO NOT USE IN PRODUCTION.  FOR DEMONSTRATION PURPOSES ONLY.
 */
export class StorybookThemeProvider extends LitElement {
    private themeProvider = new ThemeProvider(this);

    static readonly styles = [
        css`
            :host {
                display: contents;
            }
        `,
    ];

    render() {
        return html`<slot></slot>`;
    }
}
