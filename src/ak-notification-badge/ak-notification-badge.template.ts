import { html, nothing } from "lit";
import type { INotificationBadge } from "./ak-notification-badge.types.js";
import "../ak-icon/ak-icon.js";

type TemplateProps = Pick<INotificationBadge, "count">;

export const template = ({ count }: TemplateProps) =>
    html` <div role="button" tabindex="0" part="notification-badge">
        <div part="icon">
            <slot><ak-icon icon="bell"></ak-icon></slot>
        </div>
        ${count > 0 ? html`<div part="count">${count}</div>` : nothing}
    </div>`;
