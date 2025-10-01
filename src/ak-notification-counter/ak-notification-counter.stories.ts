import "./ak-notification-counter.js";

import { akNotificationCounter, NotificationCounter } from "./ak-notification-counter.js";

import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

type StoryProps = Pick<Partial<NotificationCounter>, "count">;

const metadata: Meta<Partial<StoryProps>> = {
    title: "Elements / Notification Counter",
    component: "ak-notification-counter",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: /* md */ `
A notification counter component that displays a bell icon with an optional badge showing 
the number of unread notifications. When the count is zero, only the bell is shown. When 
count is greater than zero, the bell's appearance inverts (white bell on colored background) 
and a circular badge appears in the upper right corner.

The component is clickable and emits an \`ak-notification-toggle\` event when activated.

### Accessibility

Uses \`role="status"\` with debounced \`aria-live="polite"\` announcements. This prevents 
screen reader spam when multiple notifications arrive rapidly - the component waits for the 
count to stabilize for 2 seconds before announcing the new total.

### Sizing

The component has a 1:1 aspect ratio and scales based on the parent element's font-size. 
Set font-size on the parent container to control the overall size of the notification counter.

### Custom Properties

This component uses the \`--ak-v1-\` prefix for custom CSS properties rather than PatternFly's 
\`--pf-v5-\` prefix, as it has no PatternFly equivalent.
`,
            },
        },
        layout: "centered",
    },
    argTypes: {
        count: {
            control: { type: "number", min: 0, max: 999 },
            description: "Number of unread notifications",
        },
    },
};

export default metadata;

type Story = StoryObj<StoryProps>;

const describe = (story: string) => ({ parameters: { docs: { description: { story } } } });

// Basic counter with no notifications
export const NoNotifications: Story = {
    ...describe("When count is 0, only the bell icon is displayed with no badge."),
    args: {
        count: 0,
    },
    render: (args) => html`
        <div style="font-size: 48px;">
            <ak-notification-counter count=${args.count}></ak-notification-counter>
        </div>
    `,
};

// Single notification
export const SingleNotification: Story = {
    ...describe(
        "When count is 1, the bell appearance inverts and a badge displays '1'. Screen readers announce 'One unread notification'."
    ),
    args: {
        count: 1,
    },
    render: (args) => html`
        <div style="font-size: 48px;">
            <ak-notification-counter count=${args.count}></ak-notification-counter>
        </div>
    `,
};

// Multiple notifications
export const MultipleNotifications: Story = {
    ...describe(
        "With count > 1, the badge displays the number. Screen readers announce the count with proper pluralization."
    ),
    args: {
        count: 5,
    },
    render: (args) => html`
        <div style="font-size: 48px;">
            <ak-notification-counter count=${args.count}></ak-notification-counter>
        </div>
    `,
};

// High notification count
export const HighCount: Story = {
    ...describe(
        "The component displays any count value, though visual overflow may occur with very large numbers (999+). Consider implementing a maximum display value like '99+' in production."
    ),
    args: {
        count: 142,
    },
    render: (args) => html`
        <div style="font-size: 48px;">
            <ak-notification-counter count=${args.count}></ak-notification-counter>
        </div>
    `,
};

// Size variants
export const SizeVariants: Story = {
    ...describe(
        "The component scales with the parent's font-size, maintaining its 1:1 aspect ratio. Set font-size on the parent container to control size."
    ),
    render: () => html`
        <div style="display: flex; gap: 2rem; align-items: center;">
            <div style="font-size: 24px;">
                <ak-notification-counter count="3"></ak-notification-counter>
                <div style="font-size: 12px; text-align: center; margin-top: 0.5rem;">24px</div>
            </div>
            <div style="font-size: 32px;">
                <ak-notification-counter count="7"></ak-notification-counter>
                <div style="font-size: 12px; text-align: center; margin-top: 0.5rem;">32px</div>
            </div>
            <div style="font-size: 48px;">
                <ak-notification-counter count="12"></ak-notification-counter>
                <div style="font-size: 12px; text-align: center; margin-top: 0.5rem;">48px</div>
            </div>
            <div style="font-size: 64px;">
                <ak-notification-counter count="23"></ak-notification-counter>
                <div style="font-size: 12px; text-align: center; margin-top: 0.5rem;">64px</div>
            </div>
        </div>
    `,
};

// Interactive example with event handling
export const InteractiveWithEvents: Story = {
    ...describe(
        "Click the notification counter to see the ak-notification-toggle event. In a real application, this would open a notification panel or drawer."
    ),
    args: {
        count: 8,
    },
    render: (args) => html`
        <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center;">
            <div style="font-size: 48px;">
                <ak-notification-counter
                    count=${args.count}
                    @ak-notification-toggle=${() => {
                        alert("Notification panel would open here!");
                    }}
                ></ak-notification-counter>
            </div>
            <p style="font-size: 14px; color: #6a6e73;">Click the bell icon above</p>
        </div>
    `,
};

// Using the builder function
export const UsingBuilder: Story = {
    ...describe(
        "The akNotificationCounter builder function provides a programmatic way to create instances with type safety."
    ),
    render: () => html`
        <div style="display: flex; gap: 2rem; align-items: center;">
            <div style="font-size: 48px;">${akNotificationCounter({ count: 0 })}</div>
            <div style="font-size: 48px;">${akNotificationCounter({ count: 1 })}</div>
            <div style="font-size: 48px;">${akNotificationCounter({ count: 15 })}</div>
            <div style="font-size: 48px;">${akNotificationCounter({ count: 99 })}</div>
        </div>
    `,
};

// In context example
export const InNavigationBar: Story = {
    ...describe(
        "Typical usage in a navigation bar or toolbar. The counter integrates naturally with other navigation elements."
    ),
    render: () => html`
        <nav
            style="display: flex; gap: 1.5rem; align-items: center; padding: 1rem; background: #151515; color: white; font-size: 24px;"
        >
            <span style="margin-right: auto; font-weight: bold;">My App</span>
            <button
                style="background: none; border: none; color: white; cursor: pointer; font-size: inherit;"
            >
                Home
            </button>
            <button
                style="background: none; border: none; color: white; cursor: pointer; font-size: inherit;"
            >
                Settings
            </button>
            <ak-notification-counter count="12"></ak-notification-counter>
            <button
                style="background: none; border: none; color: white; cursor: pointer; font-size: inherit;"
            >
                Profile
            </button>
        </nav>
    `,
};
