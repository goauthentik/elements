import { NotificationCounter } from "./ak-notification-counter.component.js";

import { html } from "lit";

export type AkNotificationCounterProps = Partial<Pick<NotificationCounter, "count">>;

/**
 * @summary Helper function to create a NotificationCounter component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-notification-counter element
 *
 * @see {@link NotificationCounter} - The underlying web component
 */
export function akNotificationCounter(options: AkNotificationCounterProps = {}) {
    const { count = 0 } = options;
    return html` <ak-notification-counter count="${count}"></ak-notification-counter> `;
}
