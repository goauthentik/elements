import { Hint } from "./ak-hint.component.js";

import { html, TemplateResult } from "lit";

export type HintProps = {
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

export function akHint(options: HintProps = {}) {
    const { title, body, footer } = options;

    return html`
        <ak-hint>
            ${title ? html`<div slot="title">${title}</div>` : ""}
            ${body ? html`<span>${body}</span>` : ""}
            ${footer ? html`<div slot="footer">${footer}</div>` : ""}
        </ak-hint>
    `;
}
