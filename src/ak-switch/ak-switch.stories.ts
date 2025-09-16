import "./ak-switch.js";

import { SwitchInput } from "./ak-switch.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type Renderable = string | TemplateResult;

type StoryArgs = SwitchInput;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const metadata: Meta<StoryArgs> = {
    title: "Elements/Switch",
    component: "ak-switch",
    tags: ["autodocs"],
    argTypes: {
        checked: {
            control: "boolean",
            description: "Whether the switch is checked/enabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        disabled: {
            control: "boolean",
            description: "Whether the switch is disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        required: {
            control: "boolean",
            description: "Whether the input is required in a form",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        name: {
            control: "text",
            description: "The name attribute for the input element",
            table: {
                type: { summary: "string" },
            },
        },
        value: {
            control: "text",
            description: "Value attribute for the input element",
            table: {
                type: { summary: "string" },
            },
        },
        showText: {
            control: "boolean",
            description: "Whether to show on/off text",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        useCheck: {
            control: "boolean",
            description: "Show a check icon in the empty space when 'on'",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        labelOn: {
            control: "text",
            description: "Text to show when switch is on",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "On" },
            },
        },
        labelOff: {
            control: "text",
            description: "Text to show when switch is off",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Off" },
            },
        },
        ariaLabel: {
            control: "text",
            description: "Aria label for the switch",
            table: {
                type: { summary: "string" },
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component: `
# Switch

A toggle switch component that can be used as a visual toggle for boolean settings.
`,
            },
        },
        layout: "centered",
    },
};

export default metadata;

type Story = StoryObj<StoryArgs>;

const Template = {
    render: (args: StoryArgs) => html`
        <ak-switch
            ?checked=${!!args.checked}
            ?disabled=${!!args.disabled}
            ?required=${!!args.required}
            ?reverse=${!!args.reverse}
            ?show-text=${!!args.showText}
            ?use-check=${!!args.useCheck}
            name=${ifDefined(args.name)}
            value=${ifDefined(args.value)}
            aria-label=${ifDefined(args.ariaLabel ?? undefined)}
        >
            ${args.label ? html`<p slot="label">${args.label}</p>` : ""}
            ${args.labelOn ? html`<p slot="label-on">${args.labelOn}</p>` : ""}
        </ak-switch>
    `,
};

export const Basic: Story = {
    ...Template,
    args: {},
};

// Checked Switch
export const Checked: Story = {
    ...Template,
    args: {
        checked: true,
    },
};

// Disabled Switch
export const Disabled: Story = {
    ...Template,
    args: {
        disabled: true,
    },
};

// Disabled Checked Switch
export const DisabledChecked: Story = {
    ...Template,
    args: {
        disabled: true,
        checked: true,
    },
};

// Switch with On/Off Text
export const WithOnOffText: Story = {
    ...Template,
    args: {
        showText: true,
        labelOn: "On",
        label: "Off",
    },
};

// Switch with On/Off Text
export const WithOnOffTextReversed: Story = {
    ...Template,
    args: {
        useCheck: true,
        showText: true,
        reverse: true,
        labelOn: "On",
        label: "Off",
    },
};

// Form Integration
export const FormIntegration: Story = {
    args: {
        name: "switchOption",
        value: "optionValue",
        required: true,
    },
    render: (args) => html`
        <form
            id="switch-form"
            @submit=${(e: Event) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                // eslint-disable-next-line no-alert
                alert(
                    `Form submitted with value: ${formData.get("switchOption") || "not selected"}`,
                );
            }}
        >
            <div style="margin-bottom: 1rem;">
                <ak-switch
                    ?checked=${args.checked}
                    name=${ifDefined(args.name)}
                    value=${ifDefined(args.value)}
                    ?required=${args.required}
                >
                    Required form option
                </ak-switch>
            </div>
            <button type="submit">Submit Form</button>
        </form>
    `,
};

// Custom Styling
export const CustomStyling: Story = {
    args: {},
    render: (args) => html`
        <style>
            .custom-switch {
                --pf-v5-c-switch--checked--BackgroundColor: #2ecc71;
                --pf-v5-c-switch__toggle--Width: 60px;
                --pf-v5-c-switch__toggle--Height: 30px;
                --pf-v5-c-switch__knob--Size: 24px;
                --pf-v5-c-switch__toggle--BorderRadius: 6px;
                --pf-v5-c-switch__knob--BorderRadius: 4px;
            }
        </style>
        <label>Custom styled switch </label>
        <ak-switch class="custom-switch" ?checked=${args.checked}> </ak-switch>
    `,
};

// Multiple Switches
export const MultipleSwitches: Story = {
    args: {},
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <ak-switch>Default option</ak-switch>
            <ak-switch checked>Checked option</ak-switch>
            <ak-switch disabled>Disabled option</ak-switch>
            <ak-switch reverse>Reversed option</ak-switch>
            <ak-switch show-text>Option with text</ak-switch>
        </div>
    `,
};

// Event Handling
export const EventHandling: Story = {
    args: {},
    render: () => html`
        <div
            style="display: flex; flex-direction: column; align-content: center; gap: 1rem; min-width: 24ch"
        >
            <div id="event-status">Switch state: unchecked</div>
            <ak-switch
                @change=${(e: CustomEvent) => {
                    const status = document.getElementById("event-status");
                    if (status) {
                        status.textContent = `Switch state: ${e.detail.checked ? "checked" : "unchecked"}`;
                    }
                }}
            >
            </ak-switch>
        </div>
    `,
};
