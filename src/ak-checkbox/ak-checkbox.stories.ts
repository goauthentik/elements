import "./ak-checkbox.js";

import { CheckboxInput } from "./ak-checkbox.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type StoryArgs = CheckboxInput & {
    label?: string;
    labelOn?: string;
};

const metadata: Meta<StoryArgs> = {
    title: "Elements/Checkbox",
    component: "ak-checkbox",
    tags: ["autodocs"],
    argTypes: {
        checked: {
            control: "boolean",
            description: "Whether the checkbox is checked",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        indeterminate: {
            control: "boolean",
            description: "Whether the checkbox is in indeterminate state (mixed)",
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
        required: {
            control: "boolean",
            description: "Whether the checkbox is required in a form",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        name: {
            control: "text",
            description: "The name attribute for form submission",
            table: {
                type: { summary: "string" },
            },
        },
        value: {
            control: "text",
            description: "Value submitted when checkbox is checked",
            table: {
                type: { summary: "string" },
            },
        },
        reverse: {
            control: "boolean",
            description: "Whether to reverse the checkbox and label positions",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        showLabel: {
            control: "boolean",
            description: "Whether to show label content alongside the checkbox",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        ariaLabel: {
            control: "text",
            description: "Aria label for the checkbox",
            table: {
                type: { summary: "string" },
            },
        },
        label: {
            control: "text",
            description: "Label text content (for demo purposes)",
            table: {
                type: { summary: "string" },
            },
        },
        labelOn: {
            control: "text",
            description: "Label text when checked (for demo purposes)",
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

A checkbox component for boolean form inputs with customizable label positioning, indeterminate state support, and accessibility features.

### Key Features:

- **Form Integration**: Works with native form submission and validation
- **Indeterminate State**: Supports mixed/partial selection state
- **Flexible Labeling**: Multiple label slots with conditional rendering
- **Custom Icons**: Replaceable check and indeterminate icons via slots
- **Accessibility**: Full ARIA support and keyboard navigation

### Usage:

The checkbox can be used standalone or with labels. The \`indeterminate\` state is useful for hierarchical selections where some (but not all) child items are selected.
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
            ?indeterminate=${!!args.indeterminate}
            ?disabled=${!!args.disabled}
            ?required=${!!args.required}
            ?reverse=${!!args.reverse}
            ?label=${!!args.showLabel}
            name=${ifDefined(args.name)}
            value=${ifDefined(args.value)}
            aria-label=${ifDefined(args.ariaLabel ?? undefined)}
        >
            ${args.label ? html`<span slot="label">${args.label}</span>` : ""}
            ${args.labelOn ? html`<span slot="label-on">${args.labelOn}</span>` : ""}
        </ak-checkbox>
    `,
};

export const Basic: Story = {
    ...Template,
    args: {},
};

export const Checked: Story = {
    ...Template,
    args: {
        checked: true,
    },
};

export const Indeterminate: Story = {
    ...Template,
    args: {
        indeterminate: true,
        label: "Select all items",
    },
    parameters: {
        docs: {
            description: {
                story: "Indeterminate state represents partial selection, commonly used for parent checkboxes when only some child items are selected.",
            },
        },
    },
};

export const Disabled: Story = {
    ...Template,
    args: {
        disabled: true,
        label: "Disabled option",
    },
};

export const DisabledChecked: Story = {
    ...Template,
    args: {
        disabled: true,
        checked: true,
        label: "Disabled checked",
    },
};

export const DisabledIndeterminate: Story = {
    ...Template,
    args: {
        disabled: true,
        indeterminate: true,
        label: "Disabled indeterminate",
    },
};

export const WithLabels: Story = {
    ...Template,
    args: {
        label: "Default label",
        labelOn: "Selected!",
    },
    parameters: {
        docs: {
            description: {
                story: "Demonstrates conditional label text - shows different content when checked vs unchecked.",
            },
        },
    },
};

export const Reversed: Story = {
    ...Template,
    args: {
        reverse: true,
        label: "Checkbox on the right",
    },
    parameters: {
        docs: {
            description: {
                story: "Reversed layout places the checkbox on the right side of the label.",
            },
        },
    },
};

export const FormIntegration: Story = {
    args: {
        name: "agreement",
        value: "accepted",
        required: true,
        label: "I agree to the terms and conditions",
    },
    render: (args) => html`
        <form
            id="checkbox-form"
            @submit=${(e: Event) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                // eslint-disable-next-line no-alert
                alert(
                    `Form submitted with: ${
                        Array.from(formData.entries())
                            .map(([k, v]) => `${k}=${v}`)
                            .join(", ") || "no data"
                    }`,
                );
            }}
        >
            <div style="margin-bottom: 1rem;">
                <ak-checkbox
                    ?checked=${args.checked}
                    ?required=${args.required}
                    name=${ifDefined(args.name)}
                    value=${ifDefined(args.value)}
                >
                    ${args.label}
                </ak-checkbox>
            </div>
            <button type="submit">Submit Form</button>
            <button type="reset" style="margin-left: 0.5rem;">Reset Form</button>
        </form>
    `,
    parameters: {
        docs: {
            description: {
                story: "Demonstrates form integration with validation. Try submitting without checking the required checkbox.",
            },
        },
    },
};

export const CustomIcons: Story = {
    args: {},
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
            <ak-checkbox checked>
                <svg slot="icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path
                        d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                    />
                </svg>
                Custom check icon
            </ak-checkbox>

            <ak-checkbox indeterminate>
                <svg
                    slot="indeterminate"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"
                    />
                </svg>
                Custom indeterminate icon
            </ak-checkbox>

            <ak-checkbox>
                <span style="font-weight: bold; color: #28a745;">✓</span>
                <div slot="icon">Text-based check</div>
            </ak-checkbox>
        </div>
    `,
    parameters: {
        docs: {
            description: {
                story: "Custom icons can be provided via slots. Both SVG and text content work.",
            },
        },
    },
};

export const MultipleCheckboxes: Story = {
    args: {},
    render: () => html`
        <fieldset style="border: 1px solid #ccc; padding: 1rem; border-radius: 4px;">
            <legend>Preferences</legend>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <ak-checkbox name="notifications" value="email"> Email notifications </ak-checkbox>
                <ak-checkbox name="notifications" value="sms" checked>
                    SMS notifications
                </ak-checkbox>
                <ak-checkbox name="marketing" value="yes"> Marketing emails </ak-checkbox>
                <ak-checkbox name="newsletter" value="weekly" indeterminate>
                    Weekly newsletter (some topics selected)
                </ak-checkbox>
                <ak-checkbox disabled> Premium features (upgrade required) </ak-checkbox>
            </div>
        </fieldset>
    `,
};

export const EventHandling: Story = {
    args: {},
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem; min-width: 20rem;">
            <div
                id="event-status"
                style="padding: 0.5rem; background: #f5f5f5; border-radius: 4px; font-family: monospace;"
            >
                Checkbox state: unchecked
            </div>
            <ak-checkbox
                name="demo"
                value="test-value"
                @change=${(e: CustomEvent) => {
                    const status = document.getElementById("event-status");
                    if (status) {
                        const detail = e.detail;
                        status.textContent = `Checkbox state: ${detail.checked ? "checked" : "unchecked"}, value: ${detail.value || "none"}`;
                    }
                }}
            >
                Toggle me to see events
            </ak-checkbox>
        </div>
    `,
    parameters: {
        docs: {
            description: {
                story: "Demonstrates change event handling with detailed event data.",
            },
        },
    },
};

export const LabelAssociation: Story = {
    args: {},
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
                <label
                    for="external-checkbox"
                    style="display: block; margin-bottom: 0.5rem; font-weight: bold;"
                >
                    External Label (click me!)
                </label>
                <ak-checkbox id="external-checkbox" name="external" value="yes"> </ak-checkbox>
            </div>

            <ak-checkbox name="internal"> Internal label content </ak-checkbox>

            <ak-checkbox name="both" id="both-checkbox"> Internal content </ak-checkbox>
            <label for="both-checkbox" style="font-size: 0.9em; color: #666;">
                Additional external label
            </label>
        </div>
    `,
    parameters: {
        docs: {
            description: {
                story: "Shows different label association patterns. External labels with 'for' attribute work alongside internal label slots.",
            },
        },
    },
};

export const SizeVariants: Story = {
    args: {},
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
                <h4 style="margin: 0 0 0.5rem 0;">Small</h4>
                <ak-checkbox checked style="--pf-v5-c-checkbox--FontSize: 0.875rem;">
                    Small checkbox
                </ak-checkbox>
            </div>

            <div>
                <h4 style="margin: 0 0 0.5rem 0;">Default</h4>
                <ak-checkbox checked> Default size checkbox </ak-checkbox>
            </div>

            <div>
                <h4 style="margin: 0 0 0.5rem 0;">Large</h4>
                <ak-checkbox checked style="--pf-v5-c-checkbox--FontSize: 1.25rem;">
                    Large checkbox
                </ak-checkbox>
            </div>
        </div>
    `,
    parameters: {
        docs: {
            description: {
                story: "Checkbox size can be controlled via CSS custom properties.",
            },
        },
    },
};
