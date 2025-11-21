import { SwitchInput } from "./ak-switch.js";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

/**
 * Configuration options for the akSwitch helper function
 */
export type SwitchProps = Partial<
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
    reverse?: boolean;
};

/**
 * @summary Helper function to create a Switch component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-switch element
 *
 * @see {@link SwitchInput} - The underlying web component
 */
export function akSwitch(options: SwitchProps = {}): TemplateResult {
    const {
        name,
        checked,
        required,
        disabled,
        value,
        useCheck,
        showLabel,
        ariaLabel,
        reverse,
        label,
        labelOn,
        icon,
    } = options;

    const intoSlot = (slot: string, s?: TemplateResult | string) =>
        typeof s === "string" ? html`<span slot=${slot}>${s}</span>` : (s ?? "");

    // The icon handling looks odd, but bear with it:
    // - If icon is a string, we pass it as an attribute to switch,
    //   so switch can look up the icon itself.a
    // - If icon is nullish, we put nothing into the template.
    // - Otherwise, we assume icon is some renderable thing of
    //   TemplateResultwith the proper `slot="icon"` attribute.
    //
    return html`
        <ak-switch
            name=${ifDefined(name)}
            ?checked=${Boolean(checked)}
            ?required=${Boolean(required)}
            ?disabled=${Boolean(disabled)}
            ?reverse=${Boolean(reverse)}
            check-icon=${ifDefined(typeof icon === "string" ? icon : undefined)}
            value=${ifDefined(value ?? undefined)}
            ?use-check=${Boolean(useCheck)}
            ?label=${Boolean(showLabel)}
            aria-label=${ifDefined(ariaLabel ?? undefined)}
        >
            ${intoSlot("label", label)} ${intoSlot("label-on", labelOn)}
            ${typeof icon === "string" ? "" : (icon ?? "")}
        </ak-switch>
    `;
}
