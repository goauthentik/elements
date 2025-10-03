import { TemplateResult } from "lit";

type Notifier = (_: number) => string;

export interface INotificationBadge {
    count: number;
    notifier: Notifier;
}

export interface NotificationBadgeProps extends INotificationBadge {
    icon: TemplateResult;
    variant: "read" | "unread" | "attention";
    expanded?: boolean;
    theme?: "dark" | "light";
}
