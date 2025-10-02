import "./ak-notification-counter.js";

import { akNotificationCounter, Brand } from "./ak-notification-counter.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

const metadata: Meta<NotificationCounter> = {
    title: "Application / NotificationCounter",
    component: "ak-notification-counter",
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `
# NotificationCounter Component

The NotificationCounter component is for showing logos, notification-counters, and icons.
                `,
            },
        },
        argTypes: {
            src: {
                control: "text",
                description: "The URL to the notification-counter image",
                table: {
                    type: { summary: "string" },
                    defaultValue: { summary: "undefined" },
                },
            },
            alt: {
                control: "text",
                description: "Alternative text for the image (required for accessibility)",
                table: {
                    type: { summary: "string" },
                    defaultValue: { summary: "undefined" },
                },
            },
        },
    },
};

export default metadata;

type Story = StoryObj<NotificationCounter>;

export const Default: StoryObj = {
    args: {
        src: "/icon_inverse_notification-counter.svg",
        alt: "authentik Security, Inc.",
    },
    render: ({ src, alt }) =>
        html`<div style="width: 300px">
            <ak-notification-counter src="${ifDefined(src)}" alt="${ifDefined(alt)}"></ak-notification-counter>
        </div>`,
};

export const WithCustomSize: Story = {
    args: {
        src: "/icon_inverse_notification-counter.svg",
        alt: "authentik Security, Inc.",
    },
    render: (args) => html`
        <style>
            .custom-sized {
                --pf-v5-c-notification-counter--Width: 100px;
                --pf-v5-c-notification-counter--Height: 100px;
            }
        </style>
        <ak-notification-counter
            class="custom-sized"
            src=${ifDefined(args.src)}
            alt=${ifDefined(args.alt)}
        ></ak-notification-counter>
    `,
};

export const ResponsiveSizing: Story = {
    args: {
        src: "/icon_inverse_notification-counter.svg",
        alt: "Responsive NotificationCounter Logo",
    },
    render: (args) => html`
        <style>
            .responsive-notification-counter {
                --pf-v5-c-notification-counter--Width: 80px;
                --pf-v5-c-notification-counter--Width-on-sm: 100px;
                --pf-v5-c-notification-counter--Width-on-md: 120px;
                --pf-v5-c-notification-counter--Width-on-lg: 140px;
                --pf-v5-c-notification-counter--Width-on-xl: 160px;
                --pf-v5-c-notification-counter--Width-on-2xl: 180px;
                --pf-v5-c-notification-counter--Height: auto;
            }
            .demo-container {
                padding: 20px;
                border: 1px dashed #ccc;
                text-align: center;
            }
            .breakpoint-info {
                margin-top: 10px;
                font-size: 12px;
                color: #666;
            }
        </style>
        <div class="demo-container">
            <ak-notification-counter
                class="responsive-notification-counter"
                src=${ifDefined(args.src)}
                alt=${ifDefined(args.alt)}
            ></ak-notification-counter>
            <div class="breakpoint-info">
                Resize your browser to see responsive sizing:<br />
                80px (default) → 100px (≥576px) → 120px (≥768px) → 140px (≥992px) → 160px (≥1200px)
                → 180px (≥1450px)
            </div>
        </div>
    `,
};

export const UsingBuilderFunction: Story = {
    args: {
        src: "/icon_inverse_notification-counter.svg",
        alt: "Built with helper function",
    },
    render: (args) => html`
        <div style="padding: 20px; border: 1px dashed #ccc; text-align: center;">
            <h4 style="margin-top: 0;">Created with akNotificationCounter() helper function</h4>
            ${akNotificationCounter({
                src: args.src,
                alt: args.alt,
            })}
            <p style="font-size: 12px; color: #666; margin-bottom: 0;">
                <code>akNotificationCounter({ src: "${args.src}", alt: "${args.alt}" })</code>
            </p>
        </div>
    `,
};
