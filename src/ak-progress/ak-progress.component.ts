import "../ak-icon/ak-icon.js";

import { AkLitElement } from "../component-base.js";
import styles from "./ak-progress.css";

import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

export const progressBarVariants = ["none", "top", "inside", "outside"] as const;
export type ProgressBarVariant = (typeof progressBarVariants)[number];

export const progressBarSize = ["sm", "lg"] as const;
export type ProgressBarSize = (typeof progressBarSize)[number];

export const progressBarSeverity = ["success", "danger", "warning"] as const;
export type ProgressBarSeverity = (typeof progressBarSeverity)[number];

export interface IProgress {
    variant?: ProgressBarVariant;
    _size?: ProgressBarSize;
    severity?: ProgressBarSeverity;
    min?: number;
    max?: number;
    value?: number;
    showIcon?: boolean;
    oneWay?: boolean;
    displayValue?: (_: number) => string;
}

const SEVERITY_ICONS = new Map<ProgressBarSeverity, string>([
    ["danger", "fa-times"],
    ["warning", "fa-exclamation-triangle"],
    ["success", "fa-check"],
]);

/**
 * @element ak-progress
 *
 * @summary A progress bar component that displays the completion progress of a task with
 * customizable variants and severity states
 *
 * @attr {string} variant - Display variant: "none", "top", "inside", "outside"
 * @attr {string} size - Size variant: "sm", "lg"
 * @attr {string} severity - Severity state: "success", "danger", "warning"
 * @attr {number} min - Minimum value for progress range
 * @attr {number} max - Maximum value for progress range
 * @attr {number} value - Current progress value
 * @attr {boolean} show-icon - Shows severity icon when severity is set
 * @attr {boolean} one-way - Prevents progress value from decreasing
 *
 * @slot label - Label text (renders in grid row 1, spans columns 1-2 for outside variant)
 * @slot icon - Icon content (renders inline within status area)
 *
 * @remarks
 * The component uses CSS Grid with specific positioning. Do not override override grid-column or
 * grid-row properties in your slotted content as this will break the layout contract defined by
 * PatternFly 5.
 *
 * @csspart main - The main container element
 * @csspart status - Container for progress value and icon display
 * @csspart status-icon - Container for the status icon element
 * @csspart bar - The background progress bar container
 * @csspart indicator - The filled portion of the progress bar
 * @csspart measure - Text display of the current progress value
 * @csspart label - Container for the label text
 *
 * @cssprop --pf-v5-c-progress--GridGap - Gap between grid elements
 * @cssprop --pf-v5-c-progress__bar--Height - Height of the progress bar
 * @cssprop --pf-v5-c-progress__bar--BackgroundColor - Background color of the progress bar
 * @cssprop --pf-v5-c-progress__indicator--BackgroundColor - Color of the progress indicator
 * @cssprop --pf-v5-c-progress__status--Gap - Gap between status elements
 * @cssprop --pf-v5-c-progress__status-icon--Color - Color of the status icon
 * @cssprop --pf-v5-c-progress--m-success__bar--BackgroundColor - Progress bar color for success state
 * @cssprop --pf-v5-c-progress--m-warning__bar--BackgroundColor - Progress bar color for warning state
 * @cssprop --pf-v5-c-progress--m-danger__bar--BackgroundColor - Progress bar color for danger state
 * @cssprop --pf-v5-c-progress--m-success__status-icon--Color - Icon color for success state
 * @cssprop --pf-v5-c-progress--m-warning__status-icon--Color - Icon color for warning state
 * @cssprop --pf-v5-c-progress--m-danger__status-icon--Color - Icon color for danger state
 * @cssprop --pf-v5-c-progress--m-inside__measure--Color - Text color for inside variant measure
 * @cssprop --pf-v5-c-progress--m-inside__measure--FontSize - Font size for inside variant measure
 * @cssprop --pf-v5-c-progress--m-outside__measure--FontSize - Font size for outside variant measure
 * @cssprop --pf-v5-c-progress--m-sm__bar--Height - Height for small size variant
 * @cssprop --pf-v5-c-progress--m-lg__bar--Height - Height for large size variant
 */
export class Progress extends AkLitElement implements IProgress {
    static readonly styles = [styles];

    @property({ type: String })
    public variant: ProgressBarVariant = "top";

    @property({ reflect: true })
    public severity?: ProgressBarSeverity;

    @property({ type: Number })
    public min = 0;

    @property({ type: Number })
    public max = 100;

    private _value = 0;

    @property({ type: Number })
    set value(value: number) {
        if (this.oneWay && value < this._value) {
            return;
        }
        this._value = value;
    }

    public get value() {
        return this._value;
    }

    public reset() {
        this._value = this.min;
        this.requestUpdate();
    }

    @property({ type: Boolean, attribute: "show-icon" })
    public showIcon = false;

    @property({ type: Boolean, attribute: "one-way" })
    public oneWay = false;

    @property({ type: Object })
    public displayValue = (value: number) => `${value}%`;

    protected get renderedValue() {
        return this.displayValue(this.value);
    }

    protected get severityIcon() {
        const icon = this.severity ? SEVERITY_ICONS.get(this.severity) : null;
        return icon ? html`<ak-icon icon="${icon}"></ak-icon>` : nothing;
    }

    protected get percentage() {
        if (this.max <= this.min) {
            return this.value >= this.max ? 100 : 0;
        }

        const range = this.max - this.min;
        const normalized = Math.min(Math.max(this.value, this.min), this.max);
        return ((normalized - this.min) / range) * 100;
    }

    public override render() {
        const width = styleMap({ width: `${this.percentage}%` });
        const showIcon = this.hasSlotted("icon") || (this.severity !== undefined && this.showIcon);
        const showStatus = this.variant !== "none" || showIcon;

        const label = this.hasSlotted("label")
            ? html`<div part="label" aria-hidden="true"><slot name="label"></slot></div>`
            : nothing;

        const measure =
            showStatus && (this.variant === "top" || this.variant === "outside")
                ? html`<span class="measure">${this.renderedValue}</span>`
                : nothing;

        const selectIcon = () =>
            this.hasSlotted("icon")
                ? html`<span part="status-icon"><slot name="icon"></slot></span>`
                : html`<span part="status-icon">${this.severityIcon}</span>`;

        const statusIcon =
            showStatus && (this.hasSlotted("icon") || showIcon) ? selectIcon() : nothing;

        const status = showStatus
            ? html`<div part="status">${measure}<!-- -->${statusIcon}</div>`
            : nothing;

        return html` <div part="main">
            ${label}
            <!-- -->
            ${status}
            <div part="bar">
                <div part="indicator" style=${width}>
                    ${this.variant === "inside"
                        ? html`<span part="measure">${this.renderedValue}</span>`
                        : nothing}
                </div>
            </div>
        </div>`;
    }
}
