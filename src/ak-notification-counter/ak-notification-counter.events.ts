export class NotificationToggleEvent extends Event {
    static readonly eventName = "ak-notification-toggle";
    constructor() {
        super(NotificationToggleEvent.eventName, { bubbles: true, composed: true });
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        [NotificationToggleEvent.eventName]: NotificationToggleEvent;
    }
}
