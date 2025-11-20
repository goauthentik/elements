import styles from "./ak-notification-counter.css";
import { NotificationToggleEvent } from "./ak-notification-counter.events";
import { template } from "./ak-notification-counter.template.js";
import type { INotificationCounter } from "./ak-notification-counter.types.js";

import { match } from "ts-pattern";

import { msg, str } from "@lit/localize";
import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

/**
 * @element ak-notification-counter
 *
 * @summary A notification badge displaying an unread count on a bell icon
 *
 * @description
 * Displays a bell icon with a circular badge showing the number of unread notifications.
 * The badge is only visible when the count is greater than zero, and the badge changes
 * color to indicate unread notifications.
 *
 * The component dispatches the event `ak-notification-toggle` when clicked.
 *
 * Accessibility: Uses `role="status"` with debounced `aria-live="polite"` announcements to prevent
 * screen reader spam when multiple notifications arrive in quick succession. The counter only
 * announces when the count increases and stabilizes for 2 seconds (configurable, see the attribute
 * `announcement-timeout`).
 *
 * @fires {NotificationToggleEvent} ak-notification-toggle - Dispatched when the component is clicked
 *
 * @attr {number} count - Number of unread notifications (default: 0, displays no badge when < 1)
 * @attr {number} announcement-timeout - Number of milliseconds to wait before changing the aria-label,
 *    which would trigger a screenreader to announce the count.  This allows the debouncer to wait for
 *    updates.
 *
 * @csspart notification-counter - The main container element
 * @csspart bell - The bell SVG icon (appears on both <svg> and <path> elements for color control)
 * @csspart counter - The circular badge container displaying the count
 * @csspart number - The text span inside the counter badge
 *
 * @cssprop --ak-v1-c-notification-counter--BackgroundColor - Background color of the component
 *     (default: inherit, changes to primary-color-100 when counter is visible)
 * @cssprop --ak-v1-c-notification-counter--BorderRadius - Border radius applied to the main
 *     container (default: 3px)
 * @cssprop --ak-v1-c-notification-counter__icon--Color - Fill and stroke color of the bell icon
 *     (default: #151515, changes to white when counter is visible)
 * @cssprop --ak-v1-c-notification-counter__counter--BackgroundColor - Background color of the
 *      counter badge (default: #0066cc, changes to #151515 when counter is visible)
 * @cssprop --ak-v1-c-notification-counter__counter--Color - Text color inside the counter badge
 *      (default: #ffffff)
 */
export class NotificationCounter extends LitElement implements INotificationCounter {
    static readonly styles = [styles];

    @property({ type: Number, attribute: "count" })
    public count = 0;

    @property({ type: Number, attribute: "announcement-timeout" })
    public timeout = 2000;

    // Debounce the announcer so if a lot of notifications come in, in a short time, they don't spam
    // someone using a screenreader.
    #liveTimeout?: ReturnType<typeof window.setTimeout>;
    #lastAnnouncement = 0;

    constructor() {
        super();
        this.addEventListener("click", () => {
            this.dispatchEvent(new NotificationToggleEvent());
        });
    }

    // Don't try to make an announcement while the component is being disconnected.
    public override disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#liveTimeout) {
            clearTimeout(this.#liveTimeout);
        }
    }

    get #ariaCounterText() {
        return match<number, string>(this.count)
            .with(0, () => msg("No unread notifications"))
            .with(1, () => msg("One unread notification"))
            .otherwise((count) => msg(str`${count} unread notifications`));
    }

    #updateAriaCounter() {
        const announcement = this.#ariaCounterText;
        if (this.count > this.#lastAnnouncement && this.#liveTimeout) {
            clearTimeout(this.#liveTimeout);
        }
        this.#liveTimeout = setTimeout(() => {
            this.#lastAnnouncement = this.count;
            this.setAttribute("aria-label", announcement);
        }, this.timeout);
    }

    public override render() {
        const { count } = this;
        return template({ count });
    }

    public override firstUpdated(changed: PropertyValues<this>) {
        super.firstUpdated(changed);
        if (!this.hasAttribute("aria-label")) {
            this.#updateAriaCounter();
        }
        if (!this.hasAttribute("role")) {
            this.setAttribute("role", "status");
        }
        if (!this.hasAttribute("aria-live")) {
            this.setAttribute("aria-live", "polite");
        }
    }

    public override updated(changed: PropertyValues<this>) {
        super.updated(changed);
        if (changed.has("count")) {
            if (this.count < 0) {
                console.warn(`Notification count is ${this.count}, which should not happen.`);
            }
            if (changed.get("count") !== this.count) {
                this.#updateAriaCounter();
            }
        }
    }
}
