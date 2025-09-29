import styles from "./ak-skip-to-content.css";
import { LitElement, html } from "lit";
import { msg } from "@lit/localize";
import { property } from "lit/decorators.js";

/**
 * @element ak-skip-to-content
 *
 * @summary A skip link that allows keyboard users to bypass navigation and jump directly to main content
 *
 * @description
 *
 * Inspired by the jump-to-content button on Github, skip-to-content is a common accessibility
 * pattern. Invisible by default, it is the first focusable element and becomes visible when
 * navigated to by the tab button. Then [Enter] or [Space] will scroll to (and, if it's focusable,
 * focus on) the target element.
 *
 * @attr {string} label - Text for both the visible button and aria-label (defaults to localized "Skip to content")
 *
 * @slot - Content to display in the button. If not provided, uses the text in the label attribute
 *
 * @csspart skip-to-content - The button element
 *
 * @cssprop --ak-v1-c-skip-to-content--Color - Text color of the skip link button (default: #fafafa)
 * @cssprop --ak-v1-c-skip-to-content--BackgroundColor - Background color of the skip link button (default: #fd4b2d)
 * @cssprop --ak-v1-c-skip-to-content--padding - Padding of the skip link button (default: 1rem)
 * @cssprop --ak-v1-c-skip-to-content--BottomRight--BorderRadius - Border radius for bottom-right corner (default: 3px)
 * @cssprop --ak-v1-c-skip-to-content--FontFamily - Font family of the button text
 *
 */
export class SkipToContent extends LitElement {
    static readonly shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
    static readonly styles = [styles];

    #targetElement: WeakRef<HTMLElement> | null = null;

    @property({ attribute: false })
    public get targetElement(): HTMLElement | null {
        return this.#targetElement?.deref() ?? null;
    }

    public set targetElement(value: HTMLElement | null) {
        this.#targetElement = value ? new WeakRef(value) : null;
    }

    @property()
    label = msg("Skip to content");

    public onClick = () => {
        const { targetElement } = this;
        if (!targetElement) {
            console.warn(`Could not find target element for skip to content`);
            return;
        }

        targetElement.scrollIntoView();
        targetElement.focus?.();
    };

    render() {
        const { label, onClick } = this;

        return html`
            <button @click=${onClick} type="button" aria-label=${label} part="skip-to-content">
                <slot>${label}</slot>
            </button>
        `;
    }
}
