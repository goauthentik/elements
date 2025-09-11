import { InternalsController } from "@patternfly/pfe-core/controllers/internals-controller.js";

import { LitElement, TemplateResult, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { AkLitElement } from "../component-base.js";
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

    @property({ type: String, attribute: "aria-label" })
    public ariaLabel: string | null = null;

    constructor() {
        super();
        this.addEventListener("click", this.#onClick);
        this.addEventListener("keydown", this.#onKeydown);
    }

    #onClick = (e: MouseEvent) => {
        if (this.disabled) {
            e.preventDefault();
            return;
        }

        this.checked = !this.checked;
    };

    #onKeydown = (e: KeyboardEvent) => {
        if (this.disabled) return;

        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            this.checked = !this.checked;
        }
    };

    protected get checkIcon() {
        if (this.hasSlotted("icon")) {
            return `<slot name="icon"></slot>`;
        }
        return typeof this._checkIcon === "string"
            ? html`<em><ak-icon size="sm" icon=${this._checkIcon}></ak-icon></em>`
            : this._checkIcon;
    }

    protected renderLabel() {
        return this.hasSlotted("label-on") && this.checked
            ? html`<slot name="label-on"></slot>`
            : html`<slot name="label"></slot>`;
    }

    private renderSwitch() {
        return html`<div part="toggle">
            <div part="toggle-icon" aria-hidden="true">${this.checkIcon}</div>
        </div>`;
    }

    private renderWithLabels() {
        return html`<div part="toggle">
                ${this.useCheck || this.hasSlotted("icon")
                    ? html`<div part="toggle-icon" aria-hidden="true">${this.checkIcon}</div>`
                    : nothing}
            </div>
            <span part="label"> ${this.renderLabel()} </span>`;
    }

    public override render() {
        return html`
            <div
                part="switch"
                tabindex="${this.disabled ? -1 : 0}"
                role="switch"
                aria-checked="${this.checked}"
                aria-disabled="${this.disabled}"
                aria-label=${ifDefined(this.ariaLabel ?? undefined)}
            >
                <!-- Hidden native input for form support -->
                <input
                    type="checkbox"
                    part="input"
                    ?checked="${this.checked}"
                    ?disabled="${this.disabled}"
                    ?required="${this.required}"
                    name="${ifDefined(this.name)}"
                    value="${ifDefined(this.value)}"
                    tabindex="-1"
                    aria-hidden="true"
                />
                ${this.hasSlotted("label") ? this.renderWithLabels() : this.renderSwitch()}
            </div>
        `;
    }

    public override updated(changedProps: Map<string, unknown>) {
        this.setAttribute("aria-checked", this.checked ? "true" : "false");
        if (changedProps.has("checked")) {
            this.internals.setFormValue(this.checked ? this.value || "on" : null);

            // Dispatch change event
            this.dispatchEvent(
                new CustomEvent("change", {
                    detail: {
                        checked: this.checked,
                        value: this.value,
                    },
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }
}
