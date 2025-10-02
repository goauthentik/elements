import styles from "./ak-notification-counter.css";
import { match } from "ts-pattern";
import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import type { INotificationBadge } from "./ak-notification-badge.types.js";
import { template } from "./ak-notification-badge.template.js";
import { NoArgsEventConstructor, NotificationToggleEvent } from "./ak-notification-badge.events.js";
import { msg, str } from "@lit/localize";

type Notifier = (_: number) => string;

const defaultNotifier: Notifier = (count) =>
    match<number, string>(count)
        .with(0, () => msg("No unread notifications"))
        .with(1, () => msg("One unread notification"))
        .otherwise((count) => msg(str`${count} unread notifications`));

export class NotificationBadge<
        N extends NoArgsEventConstructor<Event> = NoArgsEventConstructor<NotificationToggleEvent>,
    >
    extends LitElement
    implements INotificationBadge
{
    static readonly styles = [styles];

    @property({ type: Number })
    count = 0;

    @property({ type: Boolean, reflect: true })
    expanded = false;

    @property({ type: Number, attribute: "announcement-timeout" })
    public timeout = 2000;

    @property({ type: Object })
    public notifier: Notifier = defaultNotifier;

    @property({ type: Object, attribute: "notification-event" })
    // @ts-expect-error Typescript defines events as Interfaces, but this inherits from the Event class
    public BadgeEvent: N = NotificationToggleEvent;

    // Debounce the announcer so if a lot of notifications come in, in a short time, they don't spam
    // someone using a screenreader.
    #announce = false;
    #liveTimeout?: ReturnType<typeof window.setTimeout>;
    #lastAnnouncement = 0;

    constructor() {
        super();
        this.addEventListener("click", () => {
            const { BadgeEvent } = this;
            this.dispatchEvent(new BadgeEvent());
        });
    }

    // Don't try to make an announcement while the component is being disconnected.
    public override disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#liveTimeout) {
            clearTimeout(this.#liveTimeout);
        }
    }

    #updateAriaCounter() {
        const announcement = this.notifier(this.count);
        if (this.count > this.#lastAnnouncement && this.#liveTimeout) {
            clearTimeout(this.#liveTimeout);
        }
        this.#liveTimeout = setTimeout(() => {
            this.#lastAnnouncement = this.count;
            this.setAttribute("aria-label", announcement);
        }, this.timeout);
    }

    render() {
        const { count, expanded } = this;
        return template({ count, expanded });
    }

    public override firstUpdated(changed: PropertyValues<this>) {
        super.firstUpdated(changed);
        if (!this.hasAttribute("aria-label")) {
            this.#updateAriaCounter();
        }
        if (!this.hasAttribute("role")) {
            this.setAttribute("role", "status");
        }
    }

    public override updated(changed: PropertyValues<this>) {
        this.#announce = this.hasAttribute("aria-live") && this.getAttribute("aria-live") !== "off";
        if (changed.has("count")) {
            if (this.count < 0) {
                console.warn(`Notification count is ${this.count}, which should not happen.`);
            }
            if (this.#announce && changed.get("count") !== this.count) {
                this.#updateAriaCounter();
            }
        }
    }
}
