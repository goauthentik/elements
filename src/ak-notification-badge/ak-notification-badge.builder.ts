import { NotificationBadge } from "./ak-notification-badge.component.js";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { type NotificationBadgeProps } from "./ak-notification-badge.types.js";

/**
 * @summary Helper function to create a NotificationBadge component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-notification-badge element
 *
 * @see {@link NotificationBadge} - The underlying web component
 */
export function akNotificationBadge(props: NotificationBadgeProps) {
    const { icon, count = 0, expanded, variant, theme } = props;
    return html`
        <ak-notification-badge
            count=${count}
            variant=${ifDefined(variant)}
            ?expanded=${!!expanded}
            theme=${ifDefined(theme)}
        >
            >${icon}</ak-notification-badge
        >
    `;
}
