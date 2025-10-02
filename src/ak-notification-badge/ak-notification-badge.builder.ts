import { NotificationBadge } from "./ak-notification-badge.component.js";

import { TemplateResult, html } from "lit";

export type AkNotificationBadgeProps = Partial<Pick<NotificationBadge, "count" | "expanded">> & {
    icon: TemplateResult;
    read?: boolean;
    unread?: boolean;
    attention?: boolean;
};

/**
 * @summary Helper function to create a NotificationBadge component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-notification-badge element
 *
 * @see {@link NotificationBadge} - The underlying web component
 */
export function akNotificationBadge(props: AkNotificationBadgeProps) {
    const { icon, count = 0, expanded, read, unread, attention } = props;
    return html`
        <ak-notification-badge
            count=${count}
            ?expanded=${expanded}
            ?read=${read}
            ?unread=${unread}
            ?attention=${attention}
        >
            >${icon}</ak-notification-badge
        >
    `;
}
