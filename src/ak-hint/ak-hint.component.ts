import { AkLitElement } from "../component-base.js";
import styles from "./ak-hint.css";

import { html, nothing } from "lit";

/**
 * @element ak-hint
 *
 * @summary A container for displaying informative content with optional title and footer sections
 *
 * @slot - Main content body of the hint
 * @slot title - Optional title header for the hint
 * @slot footer - Optional footer content with additional information or actions
 *
 * @csspart title - The title section container
 * @csspart body - The main content body container
 * @csspart footer - The footer section container
 *
 * @cssprop --pf-v5-c-hint--GridRowGap - Gap between grid rows
 * @cssprop --pf-v5-c-hint--PaddingTop - Top padding of the hint container
 * @cssprop --pf-v5-c-hint--PaddingRight - Right padding of the hint container
 * @cssprop --pf-v5-c-hint--PaddingBottom - Bottom padding of the hint container
 * @cssprop --pf-v5-c-hint--PaddingLeft - Left padding of the hint container
 * @cssprop --pf-v5-c-hint--BackgroundColor - Background color of the hint
 * @cssprop --pf-v5-c-hint--BorderColor - Border color of the hint
 * @cssprop --pf-v5-c-hint--BorderWidth - Border width of the hint
 * @cssprop --pf-v5-c-hint--BoxShadow - Box shadow of the hint container
 * @cssprop --pf-v5-c-hint--Color - Text color of the hint content
 * @cssprop --pf-v5-c-hint__title--FontSize - Font size of the title text
 * @cssprop --pf-v5-c-hint__body--FontSize - Font size of the body text
 * @cssprop --pf-v5-c-hint__footer--child--MarginRight - Right margin of footer child elements
 * @cssprop --pf-v5-c-hint__actions--MarginLeft - Left margin of action elements
 */
export class Hint extends AkLitElement {
    static override readonly styles = [styles];

    public override render() {
        const [hasTitle, hasBody, hasFooter] = ["title", null, "footer"].map((item) =>
            this.hasSlotted(item)
        );

        return html`
            <div part="hint">
                ${hasTitle
                    ? html`<div part="title" class="title"><slot name="title"></slot></div>`
                    : nothing}
                ${hasBody ? html`<div part="body"><slot></slot></div>` : nothing}
                ${hasFooter ? html`<div part="footer"><slot name="footer"></slot></div>` : nothing}
            </div>
        `;
    }
}
