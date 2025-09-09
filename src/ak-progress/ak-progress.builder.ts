import "./ak-progress.component.js";

import { Progress, ProgressBarSize } from "./ak-progress.component.js";

import { html, nothing, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

/* The `pick`ed fields here correspond to their types in the Progress class above. */

export interface ProgressProps
    extends Partial<
        Pick<
            Progress,
            | "variant"
            | "severity"
            | "min"
            | "max"
            | "value"
            | "showIcon"
            | "oneWay"
            | "displayValue"
        >
    > {
    size?: ProgressBarSize;
    label?: string | TemplateResult;
    icon?: string | TemplateResult;
}

/**
 * @summary Helper function to create a Progress component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-progress element
 *
 * @see {@link Progress} - The underlying web component
 */
export function akProgress(options: ProgressProps) {
    const {
        variant,
        size,
        severity,
        min,
        max,
        value,
        showIcon,
        oneWay,
        displayValue,
        label,
        icon,
    } = options;

    return html`
        <ak-progress
            variant=${ifDefined(variant)}
            size=${ifDefined(size)}
            severity=${ifDefined(severity)}
            ?show-icon=${showIcon}
            ?one-way=${oneWay}
            min=${ifDefined(min)}
            max=${ifDefined(max)}
            value=${ifDefined(value)}
            .displayValue=${ifDefined(displayValue)}
        >
            ${label ? html`<div slot="label">${label}</div>` : nothing}
            ${icon ? html`<div slot="icon">${icon}</div>` : nothing}
        </ak-progress>
    `;
}
