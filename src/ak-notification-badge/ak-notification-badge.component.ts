import styles from "./ak-notification-badge.css";
import { match } from "ts-pattern";
import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import type { INotificationBadge } from "./ak-notification-badge.types.js";
import { template } from "./ak-notification-badge.template.js";
import { msg, str } from "@lit/localize";
import { AsButtonController } from "../controllers/as-button-controller.js";

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

    @property({ type: Number })
    public count = 0;

    @property({ type: Object, attribute: false })
    public notifier: Notifier = defaultNotifier;

    // Disabling check because controllers can add functionality without needing to be accessed
    // directly.
    //
    // eslint-disable-next-line no-unused-private-class-members
    #controller = new AsButtonController(this, '[part="notification-badge"]');

    render() {
        const { count } = this;
        return template({ count });
    }

    public override updated(changed: PropertyValues<this>) {
        // Avoid announcing negative numbers.  Shouldn't happen, but...
        if (changed.has("count")) {
            if (this.count <= 0) {
                this.count = 0;
                return;
            }
            this.ariaLabel = this.notifier(this.count);
        }
    }
}
