import "./ak-checkbox.js";

import { CheckboxInput } from "./ak-checkbox.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type Renderable = string | TemplateResult;

type StoryArgs = CheckboxInput;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const metadata: Meta<StoryArgs> = {
    title: "Elements/Checkbox",
    component: "ak-checkbox",
    tags: ["autodocs"],
    argTypes: {
        checked: {
            control: "boolean",
            description: "Whether the checkbox is checked/enabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        disabled: {
            control: "boolean",
            description: "Whether the checkbox is disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        indeterminate: {
            control: "boolean",
            description: "Whether the checkbox is indeterminate",
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
            description: "Text to show when checkbox is on",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "On" },
            },
        },
        labelOff: {
            control: "text",
            description: "Text to show when checkbox is off",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Off" },
            },
        },
        ariaLabel: {
            control: "text",
            description: "Aria label for the checkbox",
            table: {
                type: { summary: "string" },
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component: `
# Checkbox

A toggle checkbox component that can be used as a visual toggle for boolean settings.
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
        <ak-checkbox
            ?checked=${!!args.checked}
            ?disabled=${!!args.disabled}
            ?required=${!!args.required}
            ?indeterminate=${!!args.indeterminate}
            ?reverse=${!!args.reverse}
            ?show-text=${!!args.showText}
            ?use-check=${!!args.useCheck}
            name=${ifDefined(args.name)}
            value=${ifDefined(args.value)}
            aria-label=${ifDefined(args.ariaLabel ?? undefined)}
        >
            ${args.label ? html`<p slot="label">${args.label}</p>` : ""}
            ${args.labelOn ? html`<p slot="label-on">${args.labelOn}</p>` : ""}
        </ak-checkbox>
    `,
};

export const Basic: Story = {
    ...Template,
    args: {},
};

// Checked Checkbox
export const Checked: Story = {
    ...Template,
    args: {
        checked: true,
    },
};

// Disabled Checkbox
export const Disabled: Story = {
    ...Template,
    args: {
        disabled: true,
    },
};

// Disabled Checked Checkbox
export const DisabledChecked: Story = {
    ...Template,
    args: {
        disabled: true,
        checked: true,
    },
};

// Checkbox with On/Off Text
export const WithOnOffText: Story = {
    ...Template,
    args: {
        showText: true,
        labelOn: "On",
        label: "Off",
    },
};

// Checkbox with On/Off Text
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
        name: "checkboxOption",
        value: "optionValue",
        required: true,
    },
    render: (args) => html`
        <form
            id="checkbox-form"
            @submit=${(e: Event) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                // eslint-disable-next-line no-alert
                alert(
                    `Form submitted with value: ${formData.get("checkboxOption") || "not selected"}`,
                );
            }}
        >
            <div style="margin-bottom: 1rem;">
                <ak-checkbox
                    ?checked=${args.checked}
                    name=${ifDefined(args.name)}
                    value=${ifDefined(args.value)}
                    ?required=${args.required}
                >
                    Required form option
                </ak-checkbox>
            </div>
            <button type="submit">Submit Form</button>
        </form>
    `,
};

export const LitEventHandling: Story = {
    args: {
        name: "checkboxOption",
        value: "optionValue",
        required: true,
    },
    render: (args) => html`
        <div style="margin-bottom: 1rem;">
            <ak-checkbox
                @click=${(e: Event) => {
                    e.preventDefault();
                    // eslint-disable-next-line no-alert
                    alert(`Box clicked with value: ${e.target.checked}`);
                }}
                ?checked=${args.checked}
                name=${ifDefined(args.name)}
                value=${ifDefined(args.value)}
                ?required=${args.required}
            >
                Required form option
            </ak-checkbox>
        </div>
    `,
};

// Multiple Checkboxes
export const MultipleCheckboxes: Story = {
    args: {},
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <ak-checkbox>Default option</ak-checkbox>
            <ak-checkbox checked>Checked option</ak-checkbox>
            <ak-checkbox disabled>Disabled option</ak-checkbox>
            <ak-checkbox reverse>Reversed option</ak-checkbox>
            <ak-checkbox show-text>Option with text</ak-checkbox>
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
            <div id="event-status">Checkbox state: unchecked</div>
            <ak-checkbox
                @change=${(e: CustomEvent) => {
                    const status = document.getElementById("event-status");
                    if (status) {
                        status.textContent = `Checkbox state: ${e.detail.checked ? "checked" : "unchecked"}`;
                    }
                }}
            >
            </ak-checkbox>
        </div>
    `,
};
