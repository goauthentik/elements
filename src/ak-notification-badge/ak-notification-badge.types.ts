import type { TemplateResult } from "lit";

type Notifier = (_: number) => string;

export interface INotificationBadge {
    count: number;
    disabled: boolean;
    notifier: Notifier;
}

type INotificationBadgeProps = Pick<INotificationBadge, "count"> &
    Partial<Pick<INotificationBadge, "disabled" | "notifier">>;

export interface NotificationBadgeProps extends INotificationBadgeProps {
    icon?: TemplateResult;
    variant: "read" | "unread" | "attention";
    expanded?: boolean;
    theme?: "dark" | "light";
}
