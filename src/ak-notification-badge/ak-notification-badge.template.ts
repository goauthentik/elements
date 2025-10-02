import { html, nothing } from "lit";
import type { INotificationBadge } from "./ak-notification-badge.types.js";

export const template = ({ count, expanded }: INotificationBadge) =>
    html` <div part="notification-badge" aria-expanded=${expanded ? "true" : "false"}>
        <span part="icon"><slot></slot></span>
        ${count > 0 ? html`<span part="count">${count}</span>` : nothing}
    </div>`;
