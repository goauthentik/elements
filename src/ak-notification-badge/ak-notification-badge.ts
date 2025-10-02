import { akNotificationBadge } from "./ak-notification-badge.builder.js";
import { NotificationBadge } from "./ak-notification-badge.component.js";

export { akNotificationBadge, NotificationBadge };

window.customElements.define("ak-notification-badge", NotificationBadge);

declare global {
    interface HTMLElementTagNameMap {
        "ak-notification-badge": NotificationBadge;
    }
}
