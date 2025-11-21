import styles from "./ak-brand.css";

import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

export interface IBrand {
    src?: string;
    alt?: string;
}

/**
 * @summary A **brand** is an image used to identify an organization, corporation or project.
 *
 * @csspart brand - The image element within the component
 *
 * @cssprop --ak-v1-c-brand--Width - Base width of the brand image (default: auto)
 * @cssprop --ak-v1-c-brand--Height - Base height of the brand image (default: auto)
 * @cssprop --ak-v1-c-brand--Width-on-sm - Width on small screens (≥576px)
 * @cssprop --ak-v1-c-brand--Width-on-md - Width on medium screens (≥768px)
 * @cssprop --ak-v1-c-brand--Width-on-lg - Width on large screens (≥992px)
 * @cssprop --ak-v1-c-brand--Width-on-xl - Width on extra large screens (≥1200px)
 * @cssprop --ak-v1-c-brand--Width-on-2xl - Width on 2x large screens (≥1450px)
 * @cssprop --ak-v1-c-brand--Height-on-sm - Height on small screens (≥576px)
 * @cssprop --ak-v1-c-brand--Height-on-md - Height on medium screens (≥768px)
 * @cssprop --ak-v1-c-brand--Height-on-lg - Height on large screens (≥992px)
 * @cssprop --ak-v1-c-brand--Height-on-xl - Height on extra large screens (≥1200px)
 * @cssprop --ak-v1-c-brand--Height-on-2xl - Height on 2x large screens (≥1450px)
 */
export class Brand extends LitElement implements IBrand {
    static readonly styles = [styles];

    /** @attr {string} src - The URL for the image source */
    @property({ type: String, reflect: true })
    src?: string;

    /** @attr {string} alt - The alt text for the image (for accessibility) */
    @property({ type: String, reflect: true })
    alt?: string;

    render() {
        const { src, alt } = this;
        return html`<img
            part="brand"
            loading="lazy"
            src=${ifDefined(src)}
            alt=${ifDefined(alt)}
        />`;
    }
}
