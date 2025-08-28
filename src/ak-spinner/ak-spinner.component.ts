import keyframes from "./ak-spinner-keyframes.css";
import styles from "./ak-spinner.css";

import { msg } from "@lit/localize";
import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

/**
 * Spinner size variants. Prefer T-shirt sizes when possible.
 */
export type SpinnerSize = "sm" | "md" | "lg" | "xl";

export interface ISpinner {
    label?: string;
}
/**
 * @element ak-spinner
 *
 * A **spinner** is a visual element used to communicate that an underlying task is in progress.
 * Spinners are used with loading pages, but can also be used in buttons and smaller elements to
 * communicate on-page events.
 *
 * @summary Shows a user a "task is in progess"
 *
 * @attr {SpinnerSize} size - Size of the spinner: "sm", "md" (default), "lg", "xl"
 * @attr {string} label - Accessible label for screen readers
 * @attr {boolean} inline - Whether spinner uses inline sizing (1em)
 *
 * @usage
 * The spinner also supports an `inline` boolean attribute that sets the diameter
 * to 1em, allowing it to scale with surrounding text.
 *
 * @csspart spinner - The SVG element for the spinner container
 * @csspart circle - The SVG circle element for the actual spinning part
 *
 * @cssprop --pf-v5-c-spinner--AnimationDuration - Duration of the spinning animation
 * @cssprop --pf-v5-c-spinner--AnimationTimingFunction - Timing function for the animation
 * @cssprop --pf-v5-c-spinner--Color - Color of the spinner
 * @cssprop --pf-v5-c-spinner--Width - Width of the spinner
 * @cssprop --pf-v5-c-spinner--Height - Height of the spinner
 * @cssprop --pf-v5-c-spinner--diameter - Base diameter for the spinner
 * @cssprop --pf-v5-c-spinner--m-sm--diameter - Diameter for small size
 * @cssprop --pf-v5-c-spinner--m-md--diameter - Diameter for medium size
 * @cssprop --pf-v5-c-spinner--m-lg--diameter - Diameter for large size
 * @cssprop --pf-v5-c-spinner--m-xl--diameter - Diameter for extra large size
 * @cssprop --pf-v5-c-spinner--m-inline--diameter - Diameter for inline spinners
 * @cssprop --pf-v5-c-spinner--stroke-width - Width of the spinner stroke
 * @cssprop --pf-v5-c-spinner__path--Stroke - Stroke color of the path
 * @cssprop --pf-v5-c-spinner__path--StrokeWidth - Stroke width of the path
 * @cssprop --pf-v5-c-spinner__path--AnimationTimingFunction - Animation timing for the path
 */
export class Spinner extends LitElement {
    static override readonly styles = [styles, keyframes];

    @property()
    public label = msg("Loading...");

    public override render() {
        return html`<svg
            part="spinner"
            role="progressbar"
            viewBox="0 0 100 100"
            aria-label=${ifDefined(this.label)}
        >
            <circle part="circle" cx="50" cy="50" r="45" fill="none" />
        </svg>`;
    }
}
