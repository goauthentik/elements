import "../ak-icon/ak-icon.js";

import { AkLitElement } from "../component-base.js";
import { FormAssociatedBooleanMixin } from "../mixins/form-associated-boolean-mixin.js";
import styles from "./ak-switch.scss";

import { match, P } from "ts-pattern";

import { html, nothing, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

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
        const [noIcon, useIcon] = [!(this.useCheck || useSlot), typeof this.checkIcon === "string"];

        // prettier-ignore
        const icon = match([noIcon, useSlot, useIcon])
            .with([true, P._, P._], () => nothing)
            .with([false, true, P._], () => html`<slot name="icon"></slot>`)
            .with([false, false, true],
                () => html`<ak-icon size="sm" icon=${ifDefined(this.checkIcon)}></ak-icon>`)
            .otherwise(() => this.checkIcon);

        return icon === nothing
            ? nothing
            : html`<div part="toggle-icon" aria-hidden="true">${icon}</slot></div>`;
    }

    protected renderLabel() {
        return this.hasSlotted("label-on") && this.checked
            ? html`<slot name="label-on"></slot>`
            : html`<slot name="label"></slot>`;
    }

    private renderSwitch() {
        return html`<div part="toggle">${this.renderIcon()}</div>`;
    }

    private renderWithLabels() {
        return html`<div part="toggle">${this.renderIcon()}</div>
            <span part="label"> ${this.renderLabel()} </span>`;
    }

    public override render() {
        return html`
            <div part="switch">
                ${this.hasSlotted("label") ? this.renderWithLabels() : this.renderSwitch()}
            </div>
        `;
    }
}
