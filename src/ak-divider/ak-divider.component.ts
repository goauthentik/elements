import { AkLitElement } from "../component-base.js";
import styles from "./ak-divider.css";

import { html } from "lit";

export const dividerVariant = ["default", "strong", "subtle"] as const;
export type DividerVariant = (typeof dividerVariant)[number];

export const dividerOrientation = ["horizontal", "vertical"] as const;
export type DividerOrientation = (typeof dividerOrientation)[number];

export interface IDivider {
    variant?: DividerVariant;
    orientation?: DividerOrientation;
}

/**
 * @element ak-divider
 * @summary A visual divider that creates thematic breaks or separation between content sections
 *
 * @attr {string} variant - Visual style variant: "default", "strong", "subtle"
 * @attr {string} orientation - Layout orientation: "horizontal", "vertical"
 *
 * @slot - Optional content to display in the middle of the divider line
 *
 * @csspart divider - The main container element for the divider
 * @csspart line - The line elements (before and after content if content exists)
 * @csspart line start - The line element before content (when content is present)
 * @csspart line end - The line element after content (when content is present)
 * @csspart content - The wrapper around the slotted content
 *
 * @cssprop --pf-v5-c-divider--line-thickness - Width/thickness of the divider line
 * @cssprop --pf-v5-c-divider--color - Default color of the divider line
 * @cssprop --pf-v5-c-divider--strong-color - Color for the "strong" variant
 * @cssprop --pf-v5-c-divider--subtle-color - Color for the "subtle" variant
 * @cssprop --pf-v5-c-divider--display - Display type for the host element
 * @cssprop --pf-v5-c-divider--flex-direction - Flex direction for the divider container
 * @cssprop --pf-v5-c-divider--content-spacing - Spacing between content and lines
 * @cssprop --pf-v5-c-divider--height - Height of the divider component
 * @cssprop --pf-v5-c-divider--margin - Margin around the divider
 * @cssprop --pf-v5-c-divider__line--before--top - Top position of the line pseudo-element
 * @cssprop --pf-v5-c-divider__line--before--left - Left position of the line pseudo-element
 * @cssprop --pf-v5-c-divider__line--before--right - Right position of the line pseudo-element
 * @cssprop --pf-v5-c-divider__line--before--width - Width of the line pseudo-element
 * @cssprop --pf-v5-c-divider__line--before--height - Height of the line pseudo-element
 */
export class Divider extends AkLitElement implements IDivider {
    static readonly styles = [styles];

    render() {
        // The `null` slot means use the unnamed slot; usually only for one-slot components.
        const hasContent = this.hasSlotted(null);
        return html`<div part="divider">
            ${hasContent
                ? html` <span part="line start"></span>
                      <span part="content"><slot></slot></span>
                      <span part="line end"></span>`
                : html` <span part="line"></span> `}
        </div> `;
    }
}
