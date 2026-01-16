import type { ElementRest } from "../types.js";
import { Hint, type HintVariant } from "./ak-hint.component.js";

import { spread } from "@open-wc/lit-helpers";

import { html, nothing, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type HintProps = ElementRest & {
    variant?: HintVariant;
    // Must be named "hint"; although it's called "title" everywhere else, "title" as a field name
    // conflicts with HTMLElement.title by type.
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
    const { hint, body, footer, variant, ...rest } = options;

    return html`
        <ak-hint ${spread(rest)} variant=${ifDefined(variant)}>
            ${hint ? html`<h3 slot="title">${hint}</h3>` : nothing}
            ${body ? html`<span>${body}</span>` : nothing}
            ${footer ? html`<footer slot="footer">${footer}</footer>` : nothing}
        </ak-hint>
    `;
}
