import { TemplateResult, html } from "lit";

import { Hint } from "./ak-hint.component.js";

export type AkHintProps = {
    title?: string | TemplateResult;
    footer?: string | TemplateResult;
    body?: string | TemplateResult;
};

/**
 * @summary Helper function to create a Hint component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-hint element
 *
 * @see {@link Hint} - The underlying web component
 */

export function akHint(options: AkHintProps = {}) {
    const { title, body, footer } = options;

    return html`
        <ak-hint>
            ${title ? html`<div slot="title">${title}</div>` : ""}
            ${body ? html`<span>${body}</span>` : ""}
            ${footer ? html`<div slot="footer">${footer}</div>` : ""}
        </ak-hint>
    `;
}
