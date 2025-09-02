import { Battery } from "./ak-battery.component.js";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type BatteryProps = Partial<Pick<Battery, "severity" | "label" | "hideLabel" | "ouiaId">>;

/**
 * @summary Helper function to create a Battery component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-battery element
 *
 * @see {@link Battery} - The underlying web component
 */
export function akBattery(options: BatteryProps = {}) {
    const { severity, label, hideLabel, ouiaId } = options;
    return html`
        <ak-battery
            severity=${ifDefined(severity)}
            label=${ifDefined(label)}
            ?hide-label=${!!hideLabel}
            data-ouia-id=${ifDefined(ouiaId)}
        ></ak-battery>
    `;
}
