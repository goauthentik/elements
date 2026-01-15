import "./ak-spinner.js";

import type { ElementRest } from "../types.js";
import { type Spinner, type SpinnerSize } from "./ak-spinner.component.js";

import { spread } from "@open-wc/lit-helpers";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type SpinnerProps = ElementRest &
    Partial<Pick<Spinner, "label">> & {
        inline?: boolean;
        size?: SpinnerSize;
    };

/**
 * @summary Helper function to create a Spinner component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-spinner element
 *
 * @see {@link Spinner} - The underlying web component
 */
export function akSpinner(options: SpinnerProps = { inline: false }) {
    const { size, label, inline, ...rest } = options;

    return html`<ak-spinner
        ${spread(rest)}
        size=${ifDefined(size)}
        label=${ifDefined(label)}
        ?inline=${!!inline}
    ></ak-spinner>`;
}
