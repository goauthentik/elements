import type { ElementRest } from "../types.js";
import { Hint } from "./ak-hint.component.js";

import { spread } from "@open-wc/lit-helpers";

import { html, TemplateResult } from "lit";

export type HintProps = ElementRest & {
    hint?: string | TemplateResult;
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
    const { hint, body, footer, ...rest } = options;

    return html`
        <ak-hint ${spread(rest)}>
            ${hint ? html`<h3 slot="title">${hint}</h3>` : ""}
            ${body ? html`<span>${body}</span>` : ""}
            ${footer ? html`<footer slot="footer">${footer}</footer>` : ""}
        </ak-hint>
    `;
}
