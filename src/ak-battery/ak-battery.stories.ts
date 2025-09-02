import "./ak-battery.js";

import { type Battery, batterySeverities } from "./ak-battery.js";

import { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

const metadata: Meta<Battery> = {
    title: "Elements / Battery",
    component: "ak-battery",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
The Battery component renders a visible battery with levels. To comply with the Patternfly
standard, the levels have a backwards feel to them: "low" means "low risk of battery failure," and
so the indicator is green, whereas "high" means "high risk of battery failure," and so is red.
`,
            },
        },
        layout: "centered",
    },
    argTypes: {
        severity: {
            control: "select",
            options: batterySeverities,
            description: "Severity level of the battery.",
        },
        label: {
            control: "text",
            description: "label to put next to the battery, if any",
        },
        hideLabel: {
            control: "boolean",
            description: "Don't show the label even if supplied",
        },
    },
};

export default metadata;

type Story = StoryObj<Battery>;

const Template: Story = {
    render: (args) =>
        html`<ak-battery
            severity=${ifDefined(args.severity)}
            label=${ifDefined(args.label ?? undefined)}
            ?hide-label=${!!args.hideLabel}
        ></ak-battery>`,
};

export const Default: Story = {
    ...Template,
};

export const AllVariants: Story = {
    render: (args) =>
        html`<div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 4rem), 1fr)); gap: 2rem"
        >
            <style>
                label {
                    display: block;
                }
            </style>
            <div>
                <label>Default:</label>
                <ak-battery></ak-battery>
            </div>
            <div>
                <label>Low:</label>
                <ak-battery severity="low"></ak-battery>
            </div>
            <div>
                <label>Medium:</label>
                <ak-battery severity="medium"></ak-battery>
            </div>
            <div>
                <label>High:</label>
                <ak-battery severity="high"></ak-battery>
            </div>
            <div>
                <label>Critical:</label>
                <ak-battery severity="critical"></ak-battery>
            </div>
        </div>`,
};
