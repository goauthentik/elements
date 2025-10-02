import { NotificationCounter } from "./ak-notification-counter.component.js";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type AkNotificationCounterProps = Partial<Pick<Brand, "src" | "alt">>;

/**
 * @summary Helper function to create a NotificationCounter component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-notification-counter element
 *
 * @see {@link NotificationCounter} - The underlying web component
 */
export function akNotificationCounter(options: AkBrandProps = {}) {
    const { src, alt } = options;
    return html` <ak-notification-counter src=${ifDefined(src)} alt=${ifDefined(alt)}></ak-notification-counter> `;
}
