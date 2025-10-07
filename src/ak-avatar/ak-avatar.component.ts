import styles from "./ak-avatar.css";
import { styles as mediaStyles } from "./ak-avatar.media.css";
import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import type { IAvatar } from "./ak-avatar.types.js";

/**
 * @summary A **avatar** is an image used to identify an individual using the application
 *
 */
export class Avatar extends LitElement implements IAvatar {
    static readonly styles = [styles, mediaStyles];

    /** @attr {string} src - The URL for the image source */
    @property({ type: String, reflect: true })
    src?: string;

    /** @attr {string} alt - The alt text for the image (for accessibility) */
    @property({ type: String, reflect: true })
    alt?: string;

    @property({ type: String, reflect: true })
    border?: "light" | "dark";

    @property({ type: String, reflect: true })
    size?: "sm" | "md" | "lg" | "xl";

    render() {
        const { src, alt, size, border } = this;
        return html` <img
            part="avatar"
            src=${ifDefined(src)}
            alt=${ifDefined(alt)}
            size=${ifDefined(size)}
            border=${ifDefined(border)}
        />`;
    }
}
