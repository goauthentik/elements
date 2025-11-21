import styles from "./ak-badge.css";

import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";

export interface IBadge {
    screenReaderText?: string;
}

/**
 * @element ak-badge
 *
 * @summary A badge component for displaying status indicators, counts, or labels with read/unread states
 *
 * @attr {string} screen-reader-text - Additional text announced to screen readers but not visually displayed
 * @attr {boolean} read - Applies read state styling (gray background)
 * @attr {boolean} unread - Applies unread state styling (blue background with white text)
 *
 * @slot - Badge content, typically a number or short text
 *
 * @csspart badge - The main badge container element
 *
 * @cssprop --pf-v5-c-badge--BorderRadius - Border radius of the badge
 * @cssprop --pf-v5-c-badge--FontSize - Font size of the badge text
 * @cssprop --pf-v5-c-badge--FontWeight - Font weight of the badge text
 * @cssprop --pf-v5-c-badge--PaddingRight - Right padding inside the badge
 * @cssprop --pf-v5-c-badge--PaddingLeft - Left padding inside the badge
 * @cssprop --pf-v5-c-badge--Color - Text color of the badge
 * @cssprop --pf-v5-c-badge--MinWidth - Minimum width of the badge
 * @cssprop --pf-v5-c-badge--BackgroundColor - Background color of the badge
 * @cssprop --pf-v5-c-badge--m-read--BackgroundColor - Background color for read state
 * @cssprop --pf-v5-c-badge--m-read--Color - Text color for read state
 * @cssprop --pf-v5-c-badge--m-unread--BackgroundColor - Background color for unread state
 * @cssprop --pf-v5-c-badge--m-unread--Color - Text color for unread state
 */
export class Badge extends LitElement implements IBadge {
    static override readonly styles = [styles];

    @property({ type: String, attribute: "screen-reader-text" })
    public screenReaderText?: string;

    public override render() {
        return html`<span part="badge"><slot></slot></span> ${this.screenReaderText
                ? html`<span class="screen-reader-text">${this.screenReaderText}</span>`
                : nothing}`;
    }
}
