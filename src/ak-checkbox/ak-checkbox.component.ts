import "../ak-icon/ak-icon.js";

import { AkLitElement } from "../component-base.js";
import { FormAssociatedBooleanMixin } from "../mixins/form-associated-boolean-mixin.js";
import styles from "./ak-checkbox.scss";

import { match, P } from "ts-pattern";

import { html, nothing, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

export interface ICheckboxInput {
    name?: string;
    checked: boolean;
    required: boolean;
    disabled: boolean;
    indeterminate: boolean;
    value?: string | null;
    showLabel: boolean;
    ariaLabel: string | null;
}

const CHECK_ICON = () =>
    html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z" />
    </svg>`;

const DOT_ICON = () => html`
    <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
    </svg>
`;

/**
 * @element ak-checkbox
 *
 * @summary A checkbox component for boolean form inputs with customizable label positioning and accessibility features
 *
 * @attr {string} name - Name attribute for form submission
 * @attr {boolean} checked - Whether the checkbox is checked
 * @attr {boolean} required - Whether the checkbox is required in a form
 * @attr {boolean} disabled - Whether the checkbox is disabled
 * @attr {boolean} indeterminate - Whether the checkbox should show the "indeterminate" state
 * @attr {string} value - Value submitted when checkbox is checked
 * @attr {boolean} label - Whether to show label content alongside the checkbox
 * @attr {boolean} reverse - Whether to reverse the checkbox and label positions
 * @attr {string} aria-label - Aria label for the checkbox
 *
 * @fires change - Fired when the checkbox is toggled, contains detail with checked state and value
 *
 * @slot icon (Optional) - An alternative icon for the "checked" state
 * @slot indeterminate (Optional) - An alternative icon for the "indeterminate" state
 * @slot label (Optional) - Label content displayed next to the checkbox
 * @slot label-on (Optional) - Label content displayed next to the checkbox when it is checked
 *
 * @csspart checkbox - The main container element
 * @csspart toggle - The checkbox visual element
 * @csspart label - The label container
 *
 * @cssprop --pf-v5-c-checkbox--FontSize - Font size of the checkbox component
 * @cssprop --pf-v5-c-checkbox--LineHeight - Line height of the checkbox component
 * @cssprop --pf-v5-c-checkbox--ColumnGap - Gap between checkbox and label
 * @cssprop --pf-v5-c-checkbox__toggle--Height - Height of the checkbox
 * @cssprop --pf-v5-c-checkbox__toggle--Width - Width of the checkbox
 * @cssprop --pf-v5-c-checkbox__toggle--BorderColor - Border color of the checkbox
 * @cssprop --pf-v5-c-checkbox__toggle--BorderRadius - Border radius of the checkbox
 * @cssprop --pf-v5-c-checkbox__toggle--BorderWidth - Border width of the checkbox
 * @cssprop --pf-v5-c-checkbox__toggle--Color - Color of the checkmark icon
 * @cssprop --pf-v5-c-checkbox--focus__toggle--OutlineColor - Outline color when focused
 * @cssprop --pf-v5-c-checkbox--focus__toggle--OutlineWidth - Outline width when focused
 * @cssprop --pf-v5-c-checkbox--disabled__toggle--Color - Color when disabled
 * @cssprop --pf-v5-c-checkbox--disabled__label--Color - Label color when disabled
 * @cssprop --pf-v5-c-checkbox__label--Color - Default label color
 */
export class CheckboxInput
    extends FormAssociatedBooleanMixin(AkLitElement)
    implements ICheckboxInput
{
    static readonly styles = [styles];

    @property({ type: Boolean, attribute: "label" })
    public showLabel = false;

    @property({ type: Boolean, attribute: "reverse" })
    public reverse = false;

    @property({ type: Boolean })
    public indeterminate = false;

    protected renderIcon() {
        const [hasIndeterminate, hasIcon] = [
            this.hasSlotted("indeterminate"),
            this.hasSlotted("icon"),
        ];
        return match([this.indeterminate, this.checked, hasIndeterminate, hasIcon])
            .with([false, false, P._, P._], () => nothing)
            .with([true, P._, false, P._], () => DOT_ICON())
            .with([true, P._, true, P._], () => html`<slot name="indeterminate"></slot>`)
            .with([false, true, P._, false], () => CHECK_ICON())
            .with([false, true, P._, true], () => html`<slot name="icon"></slot>`)
            .exhaustive();
    }

    protected renderLabel() {
        return this.hasSlotted("label-on") && this.checked
            ? html`<slot name="label-on"></slot>`
            : html`<slot name="label"></slot>`;
    }

    private renderCheckbox() {
        return html`<div part="toggle">${this.renderIcon()}</div>`;
    }

    private renderWithLabels() {
        return html`<div part="toggle">${this.renderIcon()}</div>
            <span part="label"> ${this.renderLabel()} </span>`;
    }

    public override render() {
        return html`
            <div part="checkbox" tabindex="${this.disabled ? -1 : 0}">
                ${this.hasSlotted("label") ? this.renderWithLabels() : this.renderCheckbox()}
            </div>
        `;
    }

    public override updated(changed: PropertyValues<this>) {
        super.updated(changed);
        if (!this.hasAttribute("role")) {
            this.setAttribute("role", "checkbox");
        }
        this.setAriaAttribute(
            "aria-checked",
            match([this.indeterminate, this.checked])
                .with([true, P._], () => "mixed")
                .with([false, true], () => "true")
                .with([false, false], () => "false")
                .exhaustive(),
        );
    }
}
