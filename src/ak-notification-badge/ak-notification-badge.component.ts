import "../ak-icon/ak-icon.js";

import styles from "./ak-notification-badge.css";
import type { INotificationBadge } from "./ak-notification-badge.types.js";

import { match } from "ts-pattern";

import { msg, str } from "@lit/localize";
import { html, LitElement, nothing, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

type ClickHandler = GlobalEventHandlers["onchange"];
type KeydownHandler = GlobalEventHandlers["onkeydown"];

type Notifier = (_: number) => string;

const defaultNotifier: Notifier = (count) =>
    match<number, string>(count)
        .with(0, () => msg("No unread notifications"))
        .with(1, () => msg("One unread notification"))
        .otherwise((count) => msg(str`${count} unread notifications`));

/**
 * @element ak-notification-badge
 *
 * @summary An interactive notification badge displaying an icon and optional count
 *
 * @description
 * A clickable badge component that displays a notification icon (bell by default) with an
 * optional numeric count. The badge announces count changes to screen readers and supports
 * keyboard interaction (Enter/Space). Visual appearance is controlled via CSS attributes
 * for variant and theme. The component dispatches standard click events that bubble up
 * for parent components to handle state changes.
 *
 * @attr {number} count - Number of notifications to display. Only shown when greater than 0.
 *     Automatically clamped to non-negative values.
 * @attr {boolean} disabled - Whether or not this component should react to click or keyboard
 *     events.
 * @attr {string} variant - Visual variant: "read", "unread", or "attention". Controls background
 *     color and text color via CSS.
 * @attr {string} theme - Theme variant: "dark" or "light". Adjusts colors for different backgrounds
 *     via CSS.
 * @attr {boolean} expanded - Visual state indicating associated content is expanded. Affects
 *     background colors via CSS.
 * @attr {string} aria-label - Accessible label describing notification state. Automatically
 *     computed from count using notifier function.
 *
 * @prop {Notifier} notifier - Function that generates aria-label text from count. Signature:
 *     (count: number) => string. Defaults to localized messages.
 *
 * @fires click - Standard click event bubbled from internal button element. Triggered by mouse
 *     click or Enter/Space key.
 *
 * @slot - Icon to display. Defaults to bell icon from ak-icon if not provided.
 *
 * @csspart notification-badge - The main interactive container (div with role="button")
 * @csspart icon - Container for the icon/slot content
 * @csspart count - The numeric count display (only rendered when count > 0)
 *
 * @cssprop --pf-v5-c-notification-badge--PaddingTop - Top padding of the badge
 * @cssprop --pf-v5-c-notification-badge--PaddingRight - Right padding of the badge
 * @cssprop --pf-v5-c-notification-badge--PaddingBottom - Bottom padding of the badge
 * @cssprop --pf-v5-c-notification-badge--PaddingLeft - Left padding of the badge
 * @cssprop --pf-v5-c-notification-badge--MarginTop - Top margin (typically negative for alignment)
 * @cssprop --pf-v5-c-notification-badge--MarginRight - Right margin (typically negative for alignment)
 * @cssprop --pf-v5-c-notification-badge--MarginBottom - Bottom margin (typically negative for alignment)
 * @cssprop --pf-v5-c-notification-badge--MarginLeft - Left margin (typically negative for alignment)
 * @cssprop --pf-v5-c-notification-badge--after--BackgroundColor - Background color of the badge
 * @cssprop --pf-v5-c-notification-badge--after--BorderRadius - Border radius of the badge
 * @cssprop --pf-v5-c-notification-badge__count--MarginLeft - Spacing between icon and count
 */
export class NotificationBadge extends LitElement implements INotificationBadge {
    static readonly styles = [styles];

    @property({ type: Boolean })
    public disabled = false;

    @property({ type: Number })
    public count = 0;

    @property({ type: Object, attribute: false })
    public notifier: Notifier = defaultNotifier;

    private onClick = (ev: Event) => {
        if (this.disabled) {
            return;
        }

        // The event should come from the host, not an internal component. This sets the correct
        // target, the one with the actual `count` set on it.
        ev.stopPropagation();
        this.dispatchEvent(
            new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            }),
        );
    };

    // https://www.w3.org/TR/uievents/#event-type-keydown:
    // On `keydown`, if the key is the Enter or (Space) key, the default action MUST be to
    // dispatch a click event.
    private onKeydown = (ev: KeyboardEvent) => {
        // This button should not be used as a link; we do not need it to be able to open new tabs
        // or new windows.
        if (this.disabled || ev.altKey || ev.shiftKey || ev.ctrlKey || ev.metaKey) {
            return;
        }

        if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            this.onClick(ev);
        }
    };

    public willUpdate(changed: PropertyValues<this>) {
        if (this.count < 0) {
            console.warn(`Received a negative count: ${this.count}`);
            this.count = Math.max(0, this.count);
        }
        super.willUpdate(changed);
    }

    public override render() {
        const { disabled, count, onClick, onKeydown } = this;
        return html` <div
            role="button"
            @click=${onClick}
            @keydown=${onKeydown}
            tabindex=${disabled ? "-1" : "0"}
            part="notification-badge"
        >
            <div part="icon">
                <slot><ak-icon icon="bell"></ak-icon></slot>
            </div>
            ${count > 0 ? html`<div part="count">${count}</div>` : nothing}
        </div>`;
    }

    public override updated(changed: PropertyValues<this>) {
        if (changed.has("count")) {
            const notification = this.notifier(this.count);
            if (this.count === 0) {
                // After talking to Teffen, it seems setting this manually will avoid triggering a
                // notification when the count is reset.
                this.setAttribute("aria-label", notification);
            } else {
                this.ariaLabel = notification;
            }
        }
        super.updated(changed);
    }
}
