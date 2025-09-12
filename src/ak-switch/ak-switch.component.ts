import { PropertyValues, TemplateResult, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { AkLitElement } from "../component-base.js";
import { match, P } from "ts-pattern";
import "../ak-icon/ak-icon.js";
import styles from "./ak-switch.scss";
import { FormAssociatedBooleanMixin } from "./form-associated-boolean-protocol.js";

export interface ISwitchInput {
    name?: string;
    checked: boolean;
    required: boolean;
    disabled: boolean;
    value?: string | null;
    useCheck: boolean;
    showLabel: boolean;
    ariaLabel: string | null;
}

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
 * @attr {boolean} show-text - Whether to show on/off text
 * @attr {string} text-on - Text to show when switch is on
 * @attr {string} text-off - Text to show when switch is off
 * @attr {string} aria-label - Aria label for the switch
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
 */
export class SwitchInput extends FormAssociatedBooleanMixin(AkLitElement) implements ISwitchInput {
    static readonly styles = [styles];

    @property({ type: Boolean, attribute: "use-check" })
    public useCheck = false;

    @property({ type: Object, attribute: "check-icon" })
    _checkIcon?: TemplateResult | string = CHECK_ICON;

    @property({ type: Boolean, attribute: "label" })
    public showLabel = false;

    @property({ type: Boolean, attribute: "reverse" })
    public reverse = false;

    protected renderIcon() {
        const useSlot = this.hasSlotted("icon");
        const [noIcon, useIcon] = [
            !(this.useCheck || useSlot),
            typeof this._checkIcon === "string",
        ];

        // prettier-ignore
        const icon = match([noIcon, useSlot, useIcon])
            .with([true, P._, P._], () => nothing)
            .with([false, true, P._], () => html`<slot name="icon"></slot>`)
            .with([false, false, true],
                  () => html`<ak-icon size="sm" icon=${this._checkIcon}></ak-icon>`)
            .otherwise(() => this._checkIcon);

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
        return html`<div part="toggle">${this.renderIcon()}</div>
        </div>`;
    }

    private renderWithLabels() {
        return html`<div part="toggle">${this.renderIcon()}</div>
            <span part="label"> ${this.renderLabel()} </span>`;
    }

    public override render() {
        return html`
            <div part="switch" tabindex="${this.disabled ? -1 : 0}">
                ${this.hasSlotted("label") ? this.renderWithLabels() : this.renderSwitch()}
            </div>
        `;
    }

    public override updated(changed: PropertyValues<this>) {
        super.updated(changed);
        if (!this.hasAttribute("role")) {
            this.setAttribute("role", "switch");
        }
    }
}
