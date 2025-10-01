import { akNotificationCounter } from "./ak-notification-counter.builder.js";
import { NotificationCounter } from "./ak-notification-counter.component.js";

export { akNotificationCounter, NotificationCounter };

window.customElements.define("ak-notification-counter", NotificationCounter);

declare global {
    interface HTMLElementTagNameMap {
        "ak-notification-counter": NotificationCounter;
    }
}
