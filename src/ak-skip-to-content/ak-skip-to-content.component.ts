import styles from "./ak-skip-to-content.css";
import { LitElement } from "lit";
import { property } from "lit/decorators.js";

/**
 * @summary A **brand** is an image used to identify an organization, corporation or project.
 *
 * @csspart brand - The image element within the component
 *
 * @cssprop --pf-v5-c-brand--Width - Base width of the brand image (default: auto)
 * @cssprop --pf-v5-c-brand--Height - Base height of the brand image (default: auto)
 * @cssprop --pf-v5-c-brand--Width-on-sm - Width on small screens (≥576px)
 * @cssprop --pf-v5-c-brand--Width-on-md - Width on medium screens (≥768px)
 * @cssprop --pf-v5-c-brand--Width-on-lg - Width on large screens (≥992px)
 * @cssprop --pf-v5-c-brand--Width-on-xl - Width on extra large screens (≥1200px)
 * @cssprop --pf-v5-c-brand--Width-on-2xl - Width on 2x large screens (≥1450px)
 * @cssprop --pf-v5-c-brand--Height-on-sm - Height on small screens (≥576px)
 * @cssprop --pf-v5-c-brand--Height-on-md - Height on medium screens (≥768px)
 * @cssprop --pf-v5-c-brand--Height-on-lg - Height on large screens (≥992px)
 * @cssprop --pf-v5-c-brand--Height-on-xl - Height on extra large screens (≥1200px)
 * @cssprop --pf-v5-c-brand--Height-on-2xl - Height on 2x large screens (≥1450px)
 */
export class AKSkipToContent extends AKElement {
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

    public activate = () => {
        const { targetElement } = this;

        if (!targetElement) {
            console.warn(`Could not find target element for skip to content`);
            return;
        }

        targetElement.scrollIntoView();
        targetElement.focus?.();
    };

    render() {
        return html`
            <button tabindex="0" @click=${this.activate} type="button" part="skip-to-content">
                ${msg("Skip to content")}
            </button>
        `;
    }
}
