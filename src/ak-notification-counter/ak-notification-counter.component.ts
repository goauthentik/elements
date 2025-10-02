import styles from "./ak-notification-counter.css";

import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import type { INotificationCounter } from "./ak-notification-counter.types.js";
import { template } from "./ak-notification-counter.template.js";

/**
 * @summary A **notification-counter** is an image used to identify an organization, corporation or project.
 *
 * @csspart notification-counter - The image element within the component
 *
 * @cssprop --pf-v5-c-notification-counter--Width - Base width of the notification-counter image (default: auto)
 * @cssprop --pf-v5-c-notification-counter--Height - Base height of the notification-counter image (default: auto)
 * @cssprop --pf-v5-c-notification-counter--Width-on-sm - Width on small screens (≥576px)
 * @cssprop --pf-v5-c-notification-counter--Width-on-md - Width on medium screens (≥768px)
 * @cssprop --pf-v5-c-notification-counter--Width-on-lg - Width on large screens (≥992px)
 * @cssprop --pf-v5-c-notification-counter--Width-on-xl - Width on extra large screens (≥1200px)
 * @cssprop --pf-v5-c-notification-counter--Width-on-2xl - Width on 2x large screens (≥1450px)
 * @cssprop --pf-v5-c-notification-counter--Height-on-sm - Height on small screens (≥576px)
 * @cssprop --pf-v5-c-notification-counter--Height-on-md - Height on medium screens (≥768px)
 * @cssprop --pf-v5-c-notification-counter--Height-on-lg - Height on large screens (≥992px)
 * @cssprop --pf-v5-c-notification-counter--Height-on-xl - Height on extra large screens (≥1200px)
 * @cssprop --pf-v5-c-notification-counter--Height-on-2xl - Height on 2x large screens (≥1450px)
 */
export class NotificationCounter extends LitElement implements IBrand {
    static readonly styles = [styles];

    /** @attr {string} src - The URL for the image source */
    @property({ type: String, reflect: true })
    src?: string;

    /** @attr {string} alt - The alt text for the image (for accessibility) */
    @property({ type: String, reflect: true })
    alt?: string;

    render() {
        const { src, alt } = this;
        return template({ src, alt });
    }
}
