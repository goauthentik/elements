import styles from "./ak-avatar.css";

import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import type { IAvatar } from "./ak-avatar.types.js";
import { template } from "./ak-avatar.template.js";

/**
 * @summary A **avatar** is an image used to identify an organization, corporation or project.
 *
 * @csspart avatar - The image element within the component
 *
 * @cssprop --pf-v5-c-avatar--Width - Base width of the avatar image (default: auto)
 * @cssprop --pf-v5-c-avatar--Height - Base height of the avatar image (default: auto)
 * @cssprop --pf-v5-c-avatar--Width-on-sm - Width on small screens (≥576px)
 * @cssprop --pf-v5-c-avatar--Width-on-md - Width on medium screens (≥768px)
 * @cssprop --pf-v5-c-avatar--Width-on-lg - Width on large screens (≥992px)
 * @cssprop --pf-v5-c-avatar--Width-on-xl - Width on extra large screens (≥1200px)
 * @cssprop --pf-v5-c-avatar--Width-on-2xl - Width on 2x large screens (≥1450px)
 * @cssprop --pf-v5-c-avatar--Height-on-sm - Height on small screens (≥576px)
 * @cssprop --pf-v5-c-avatar--Height-on-md - Height on medium screens (≥768px)
 * @cssprop --pf-v5-c-avatar--Height-on-lg - Height on large screens (≥992px)
 * @cssprop --pf-v5-c-avatar--Height-on-xl - Height on extra large screens (≥1200px)
 * @cssprop --pf-v5-c-avatar--Height-on-2xl - Height on 2x large screens (≥1450px)
 */
export class Avatar extends LitElement implements IAvatar {
    static readonly styles = [styles];

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
            src=${src}
            alt=${ifDefined(alt)}
            size=${ifDefined(size)}
            border=${ifDefined(border)}
        />`;
    }
}
