import "../ak-icon/ak-icon.js";

import { AkLitElement } from "../component-base.js";
import { FormAssociatedBooleanMixin } from "../mixins/form-associated-boolean-mixin.js";
import styles from "./ak-switch.scss";

import { match, P } from "ts-pattern";

import { msg } from "@lit/localize";
import { html, nothing, TemplateResult } from "lit";
import { property } from "lit/decorators.js";

const CHECK_ICON = "fas fa-check";

/**
 * @element ak-switch
 *
 * @summary A toggle switch component for boolean settings with customizable text and accessibility features
 *
 * @attr {string} name - Name attribute for the input element
 * @attr {boolean} checked - Whether the switch is checked/enabled
 * @attr {boolean} required - Whether the input is required in a form
 * @attr {boolean} disabled - Whether the switch is disabled
 * @attr {string} value - Value attribute for the input element
 * @attr {boolean} show-label - Whether to show on/off text
 * @attr {string} aria-label - Aria label for the switch
 * @attr {boolean} reverse - Put the label to the *left* of the switch (To the right by default, if shown at all)
 * @attr {boolean} use-check - when true, adds an icon to the switch body when checked
 *
 * @fires change - Fired when the switch is toggled, contains detail with checked state and value
 *
 * @csspart toggle - The toggle track element
 * @csspart knob - The toggle knob element
 *
 * @cssprop --pf-v5-c-switch--FontSize - Font size of the switch
 * @cssprop --pf-v5-c-switch--LineHeight - Line height of the switch
 * @cssprop --pf-v5-c-switch--ColumnGap - Gap between switch and label
 * @cssprop --pf-v5-c-switch__toggle--Height - Height of the toggle track
 * @cssprop --pf-v5-c-switch__toggle--Width - Width of the toggle track
 * @cssprop --pf-v5-c-switch__toggle--BackgroundColor - Background color of toggle track
 * @cssprop --pf-v5-c-switch__toggle--BorderRadius - Border radius of toggle track
 * @cssprop --pf-v5-c-switch__knob--Size - Size of the toggle knob
 * @cssprop --pf-v5-c-switch__knob--BackgroundColor - Background color of the knob
 * @cssprop --pf-v5-c-switch__knob--BorderRadius - Border radius of the knob
 * @cssprop --pf-v5-c-switch__knob--BoxShadow - Box shadow of the knob
 * @cssprop --pf-v5-c-switch--checked--BackgroundColor - Background color when checked
 * @cssprop --pf-v5-c-switch--focus--OutlineColor - Outline color when focused
 * @cssprop --pf-v5-c-switch--focus--OutlineWidth - Outline width when focused
 * @cssprop --pf-v5-c-switch--disabled--BackgroundColor - Background color when disabled
 * @cssprop --pf-v5-c-switch__text--FontSize - Font size of on/off text
 * @cssprop --pf-v5-c-switch__text--Color - Color of on/off text
 * @cssprop --pf-v5-c-switch__icon--FontSize - Font size of the check icon
 * @cssprop --pf-v5-c-switch__icon--Color - Color of the check icon
 *
 * ## Slots
 * @slot label - The label to show next to switch (optional)
 * @slot label-on - An alternative label to show next to the switch when it is checked (optional)
 * @slot icon - Use an alternative icon for the checkmark
 *
 * NOTE: If you do not supply a `slot=label`, `slot=label-on` will also be ignored.
 */
export class SwitchInput extends FormAssociatedBooleanMixin(AkLitElement) {
    static readonly styles = [styles];

    @property({ type: Boolean, attribute: "use-check" })
    public useCheck = false;

    @property({ type: Object })
    public checkIcon?: TemplateResult | string = CHECK_ICON;

    @property({ type: Boolean, attribute: "show-label" })
    public showLabel = false;

    connectedCallback() {
        super.connectedCallback();
        if (!this.hasAttribute("role")) {
            this.setAttribute("role", "switch");
        }
    }

    protected renderIcon() {
        const useSlot = this.hasSlotted("icon");
        const noIcon = !this.useCheck && !useSlot;

        if (noIcon) {
            return nothing;
        }

        const fallback =
            typeof this.checkIcon === "string"
                ? html`<ak-icon size="sm" icon=${this.checkIcon}></ak-icon>`
                : this.checkIcon;

        return html`<div part="toggle-icon" aria-hidden="true">
            <slot name="icon">${fallback}</slot>
        </div>`;
    }

    protected renderLabel() {
        const dontShow = !this.showLabel && !this.hasSlotted("label");
        const showOnLabel = (this.showLabel || this.hasSlotted("label-on")) && this.checked;

        return match([dontShow, showOnLabel])
            .with([true, P._], () => nothing)
            .with(
                [false, true],
                () => html`<span part="label"><slot name="label-on">${msg("On")}</slot></span>`,
            )
            .with(
                [false, false],
                () => html`<span part="label"><slot name="label">${msg("Off")}</slot></span>`,
            )
            .exhaustive();
    }

    public override render() {
        return html`
            <div part="switch">
                <div part="toggle">${this.renderIcon()}</div>
                ${this.renderLabel()}
            </div>
        `;
    }
}
