import styles from "./ak-skip-to-content.css";
import { LitElement, html } from "lit";
import { msg } from "@lit/localize";
import { property } from "lit/decorators.js";

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
        return html`
            <button @click=${this.onClick} type="button" aria-label=${this.label} part="skip-to-content">
                <slot>${msg("Skip to content")}</slot>
            </button>
        `;
    }
}
