import "./ak-notification-badge.js";
import "../ak-icon/ak-icon.js";

import { akNotificationBadge, NotificationBadge } from "./ak-notification-badge.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type StoryArgs = NotificationBadge & {
    icon: TemplateResult;
};

const metadata: Meta<StoryArgs> = {
    title: "Application / NotificationBadge",
    component: "ak-notification-badge",
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `
# NotificationBadge Component

The NotificationBadge component is for showing logos, notification-badges, and icons.
                `,
            },
        },
        argTypes: {
            count: {
                control: { type: "number", min: 0, max: 999 },
                description: "Number of unread notifications",
            },
        },
    },
};

export default metadata;

type Story = StoryObj<StoryArgs>;

const Template = {
    render: (args: StoryArgs) =>
        html` <ak-notification-badge count=${args.count}>${args.icon}</ak-notification-badge>`,
};

export const Default: StoryObj = {
    ...Template,
    args: {
        icon: html`<ak-icon icon="bell"></ak-icon>`,
        count: 0,
    },
};
