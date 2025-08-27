import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import { type Spinner } from "./ak-spinner.js";
import "./ak-spinner.js";

export type AkSpinnerProps = Partial<Pick<Spinner, "label">> & { inline?: boolean; size?: string };

/**
 * @summary Helper function to create a Spinner component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-spinner element
 *
 * @see {@link Spinner} - The underlying web component
 */
export function akSpinner(options: AkSpinnerProps = { inline: false }) {
    const { size, label, inline } = options;

    return html`<ak-spinner size=${ifDefined(size)} label=${ifDefined(label)} ?inline=${!!inline}></ak-spinner>`;
}
