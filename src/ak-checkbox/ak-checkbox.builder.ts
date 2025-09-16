import { CheckboxInput } from "./ak-checkbox.js";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

/**
 * Configuration options for the akCheckbox helper function
 */
export type CheckboxProps = Partial<
    Pick<
        CheckboxInput,
        | "name"
        | "checked"
        | "indeterminate"
        | "required"
        | "disabled"
        | "value"
        | "reverse"
        | "showLabel"
        | "ariaLabel"
    >
> & {
    label?: TemplateResult | string;
    labelOn?: TemplateResult | string;
    icon?: TemplateResult | string;
    indeterminateIcon?: TemplateResult | string;
};

/**
 * @summary Helper function to create a Checkbox component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-checkbox element
 *
 * @see {@link CheckboxInput} - The underlying web component
 */
export function akCheckbox(options: CheckboxProps = {}): TemplateResult {
    const {
        name,
        checked,
        indeterminate,
        required,
        disabled,
        value,
        reverse,
        showLabel,
        ariaLabel,
        label,
        labelOn,
        icon,
        indeterminateIcon,
    } = options;

    const intoSlot = (slot: string, s?: TemplateResult | string) =>
        typeof s === "string" ? html`<span slot=${slot}>${s}</span>` : (s ?? "");

    // The icon handling looks odd, but bear with it:
    // - If icon is a string, we pass it as an attribute to checkbox,
    //   so checkbox can look up the icon itself.
    // - If icon is nullish, we put nothing into the template.
    // - Otherwise, we assume icon is some renderable thing of
    //   TemplateResultwith the proper `slot="icon"` attribute.
    //
    return html`
        <ak-checkbox
            name=${ifDefined(name)}
            ?checked=${Boolean(checked)}
            ?indeterminate=${Boolean(indeterminate)}
            ?required=${Boolean(required)}
            ?reverse=${Boolean(reverse)}
            ?disabled=${Boolean(disabled)}
            icon=${ifDefined(typeof icon === "string" ? icon : undefined)}
            value=${ifDefined(value)}
            ?label=${Boolean(showLabel)}
            aria-label=${ifDefined(ariaLabel ?? undefined)}
        >
            ${intoSlot("label", label)}
            <!-- -->
            ${intoSlot("label-on", labelOn)}
            <!-- -->
            ${intoSlot("icon", icon)}
            <!-- -->
            ${intoSlot("indeterminate", indeterminateIcon)}
        </ak-checkbox>
    `;
}
