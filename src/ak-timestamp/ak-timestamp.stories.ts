import "./ak-timestamp";

import { Timestamp, timestampFormats } from "./ak-timestamp";

import { spread } from "@open-wc/lit-helpers";
import type { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

const meta: Meta<Timestamp> = {
    title: "Elements/Timestamp",
    component: "ak-timestamp",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
The \`ak-timestamp\` component displays a formatted date and time with extensive customization options. The
timestamp supports various date formats, time formats, localization, and UTC display.

If the provided date is invalid or cannot be parsed, the component will display a warning
message instead of the timestamp.

## Features

- Can show dates using standard locale formats (full, long, medium, short)
- Display either local time or UTC time
- Support for custom time zone suffixes
- 12/24 hour time format options
- Localization support via browser or specified locales
- Error handling for invalid date inputs
- Accessible time display with proper semantic HTML
        `,
            },
        },
    },
    argTypes: {
        date: {
            control: "date",
            description: "The date to display",
        },
        dateFormat: {
            control: { type: "select" },
            options: timestampFormats,
            description: "Format of the displayed date",
            table: {
                defaultValue: { summary: "undefined" },
            },
        },
        timeFormat: {
            control: { type: "select" },
            options: timestampFormats,
            description: "Format of the displayed time",
            table: {
                defaultValue: { summary: "undefined" },
            },
        },
        is12Hour: {
            control: "boolean",
            description: "Whether to use 12-hour format",
            table: {
                defaultValue: { summary: "undefined (locale default)" },
            },
        },
        locale: {
            control: "text",
            description: "Locale for formatting the date/time",
            table: {
                defaultValue: { summary: "undefined (browser default)" },
            },
        },
        shouldDisplayUTC: {
            control: "boolean",
            description: "Whether to display the date/time in UTC",
            table: {
                defaultValue: { summary: false },
            },
        },
    },
};

export default meta;
type Story = StoryObj<Timestamp>;

// Helper function to convert string to Date for the stories
const template: Story = {
    render: (args) => {
        // Convert the date string to a Date object
        const dateObj = typeof args.date === "object" ? { ".raw": args.date } : { date: args.date };
        return html`
            <ak-timestamp
                ${spread(dateObj)}
                date-format=${ifDefined(args.dateFormat)}
                time-format=${ifDefined(args.timeFormat)}
                ?is-12-hour=${args.is12Hour}
                locale=${ifDefined(args.locale)}
                display-suffix=${ifDefined(args.displaySuffix)}
                ?display-utc=${args.shouldDisplayUTC}
            ></ak-timestamp>
        `;
    },
};

// Create a fixed date for consistent demo purposes
const demoDate = new Date("2023-05-15T14:30:45").toISOString();

export const Basic: Story = {
    ...template,
    args: {
        date: demoDate,
    },
};

export const DateFormats: Story = {
    render: () => html`
        <style>
            .timestamp-demo {
                display: grid;
                grid-template-columns: 120px 1fr;
                gap: 16px;
                align-items: center;
            }
            .label {
                font-weight: bold;
            }
        </style>

        <div class="timestamp-demo">
            <div class="label">Full:</div>
            <ak-timestamp date=${demoDate} date-format="full"></ak-timestamp>

            <div class="label">Long:</div>
            <ak-timestamp date=${demoDate} date-format="long"></ak-timestamp>

            <div class="label">Medium:</div>
            <ak-timestamp date=${demoDate} date-format="medium"></ak-timestamp>

            <div class="label">Short:</div>
            <ak-timestamp date=${demoDate} date-format="short"></ak-timestamp>
        </div>
    `,
};

export const TimeFormats: Story = {
    render: () => html`
        <style>
            .timestamp-demo {
                display: grid;
                grid-template-columns: 120px 1fr;
                gap: 16px;
                align-items: center;
            }
            .label {
                font-weight: bold;
            }
        </style>

        <div class="timestamp-demo">
            <div class="label">Full:</div>
            <ak-timestamp date=${demoDate} time-format="full"></ak-timestamp>

            <div class="label">Long:</div>
            <ak-timestamp date=${demoDate} time-format="long"></ak-timestamp>

            <div class="label">Medium:</div>
            <ak-timestamp date=${demoDate} time-format="medium"></ak-timestamp>

            <div class="label">Short:</div>
            <ak-timestamp date=${demoDate} time-format="short"></ak-timestamp>
        </div>
    `,
};

export const WithBothFormats: Story = {
    ...template,
    args: {
        date: demoDate,
        dateFormat: "long",
        timeFormat: "short",
    },
};

export const WithDisplaySuffix: Story = {
    ...template,
    args: {
        date: demoDate,
        dateFormat: "long",
        timeFormat: "short",
        displaySuffix: "EDT",
    },
};

export const DisplayUTC: Story = {
    ...template,
    args: {
        date: demoDate,
        dateFormat: "long",
        timeFormat: "short",
        shouldDisplayUTC: true,
    },
};

export const Using12HourFormat: Story = {
    ...template,
    args: {
        date: demoDate,
        dateFormat: "medium",
        timeFormat: "medium",
        is12Hour: true,
    },
};

export const Using24HourFormat: Story = {
    ...template,
    args: {
        date: demoDate,
        dateFormat: "medium",
        timeFormat: "medium",
        is12Hour: false,
    },
};

export const DifferentLocales: Story = {
    render: () => html`
        <style>
            .timestamp-demo {
                display: grid;
                grid-template-columns: 120px 1fr;
                gap: 16px;
                align-items: center;
            }
            .label {
                font-weight: bold;
            }
        </style>

        <div class="timestamp-demo">
            <div class="label">English (US):</div>
            <ak-timestamp
                date=${demoDate}
                date-format="long"
                time-format="short"
                locale="en-US"
            ></ak-timestamp>

            <div class="label">French:</div>
            <ak-timestamp
                date=${demoDate}
                date-format="long"
                time-format="short"
                locale="fr"
            ></ak-timestamp>

            <div class="label">German:</div>
            <ak-timestamp
                date=${demoDate}
                date-format="long"
                time-format="short"
                locale="de"
            ></ak-timestamp>

            <div class="label">Japanese:</div>
            <ak-timestamp
                date=${demoDate}
                date-format="long"
                time-format="short"
                locale="ja"
            ></ak-timestamp>

            <div class="label">Arabic:</div>
            <ak-timestamp
                date=${demoDate}
                date-format="long"
                time-format="short"
                locale="ar"
            ></ak-timestamp>
        </div>
    `,
};

export const Styling: Story = {
    render: () => html`
        <style>
            .timestamp-demo {
                display: grid;
                gap: 16px;
            }

            .demo-item {
                margin-bottom: 16px;
            }

            .emphasized-timestamp {
                --pf-v5-c-timestamp--FontSize: 1rem;
                --pf-v5-c-timestamp--Color: #0066cc;
                font-weight: bold;
            }

            .subtle-timestamp {
                --pf-v5-c-timestamp--Color: #8a8d90;
                font-style: italic;
            }

            .custom-timestamp::part(timestamp) {
                color: #5a2ca0;
                text-decoration: underline;
                font-size: 1rem;
            }
        </style>

        <div class="timestamp-demo">
            <div class="demo-item">
                <h4>Default Styling</h4>
                <ak-timestamp date=${demoDate} class="default-timestamp"></ak-timestamp>
            </div>

            <div class="demo-item">
                <h4>Emphasized with CSS Variables</h4>
                <ak-timestamp date=${demoDate} class="emphasized-timestamp"></ak-timestamp>
            </div>

            <div class="demo-item">
                <h4>Subtle with CSS Variables</h4>
                <ak-timestamp date=${demoDate} class="subtle-timestamp"></ak-timestamp>
            </div>

            <div class="demo-item">
                <h4>Using ::part selector</h4>
                <ak-timestamp date=${demoDate} class="custom-timestamp"></ak-timestamp>
            </div>
        </div>
    `,
};
