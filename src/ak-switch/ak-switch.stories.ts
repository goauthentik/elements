import "./ak-switch.js";

import { akSwitch, SwitchInput } from "./ak-switch.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type StoryArgs = SwitchInput & {
    label?: TemplateResult | string;
    labelOn?: TemplateResult | string;
};

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
            },
        },
        disabled: {
            control: "boolean",
            description: "Whether the switch is disabled",
            table: {
                type: { summary: "boolean" },
            },
        },
        required: {
            control: "boolean",
            description: "Whether the input is required in a form",
            table: {
                type: { summary: "boolean" },
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
        useCheck: {
            control: "boolean",
            description: "Show a check icon in the empty space when 'on'",
            table: {
                type: { summary: "boolean" },
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
        labelOn: "On",
        label: "Off",
    },
};

// Switch with On/Off Text
export const WithOnOffTextReversed: Story = {
    ...Template,
    args: {
        useCheck: true,
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
                --pf-v5-c-switch__input--checked__toggle--BackgroundColor: #2ecc71;
                --pf-v5-c-switch__toggle--Width: 60px;
                --pf-v5-c-switch__toggle--Height: 30px;
                --pf-v5-c-switch__toggle--before--Width: 20px;
                --pf-v5-c-switch__toggle--before--Height: 20px;
                --pf-v5-c-switch__input--checked__toggle--before--TranslateX: 30px;
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
            ${[
                ["", "Default option"],
                ["checked", "Checked option"],
                ["disabled", "Disabled option"],
                ["reverse", "Reversed option"],
            ].map(([attr, label]) => akSwitch({ [attr]: attr ? true : undefined, label }))}
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
