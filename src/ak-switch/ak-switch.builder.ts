import { TemplateResult, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import { SwitchInput } from "./ak-switch.js";

/**
 * Configuration options for the akSwitch helper function
 */
export type AkSwitchProps = Partial<
    Pick<
        SwitchInput,
        | "name"
        | "checked"
        | "required"
        | "disabled"
        | "value"
        | "useCheck"
        | "showLabel"
        | "ariaLabel"
    >
> & {
    label?: TemplateResult | string;
    labelOn?: TemplateResult | string;
    icon?: TemplateResult | string;
};

/**
 * @summary Helper function to create a Switch component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-switch element
 *
 * @see {@link SwitchInput} - The underlying web component
 */
export function akSwitch(options: AkSwitchProps = {}): TemplateResult {
    const {
        name,
        checked,
        required,
        disabled,
        value,
        useCheck,
        showLabel,
        ariaLabel,
        label,
        labelOn,
        icon,
    } = options;

    return html`
        <ak-switch
            name=${ifDefined(name)}
            ?checked=${Boolean(checked)}
            ?required=${Boolean(required)}
            ?disabled=${Boolean(disabled)}
            value=${ifDefined(value)}
            ?use-check=${Boolean(useCheck)}
            ?label=${Boolean(showLabel)}
            aria-label=${ifDefined(ariaLabel ?? undefined)}
        >
            ${label ?? ""} ${labelOn ?? ""} ${icon ?? ""}
        </ak-switch>
    `;
}
