import { IDivider } from "./ak-divider.component.js";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type DividerProps = IDivider & {
    content?: string | TemplateResult;
};

/**
 * @summary Helper function to create a Divider component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-divider element
 *
 * @see {@link Divider} - The underlying web component
 */
export function akDivider(options: DividerProps = {}) {
    const { variant, orientation, content } = options;

    // Handle string content by wrapping in a span
    const message = typeof content === "string" ? html`<span>${content.trim()}</span>` : content;

    return html`
        <ak-divider variant=${ifDefined(variant)} orientation=${ifDefined(orientation)}
            >${message}</ak-divider
        >
    `;
}
