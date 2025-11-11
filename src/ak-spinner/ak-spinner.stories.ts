import "./ak-spinner.js";

import { akSpinner, AkSpinnerProps } from "./ak-spinner.builder.js";

import { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";

const metadata: Meta<AkSpinnerProps> = {
    title: "Elements/Spinner",
    component: "ak-spinner",
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: { type: "select" },
            options: ["sm", "md", "lg", "xl"],
            description: "Size of the spinner",
            table: {
                type: { summary: "SpinnerSize" },
                defaultValue: { summary: "md" },
            },
        },
        ariaLabel: {
            control: "text",
            description: "Accessible label for screen readers",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Loading..." },
            },
        },
        inline: {
            control: "boolean",
            description: "Whether spinner uses inline sizing (1em)",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
    },
    args: {
        size: "md",
        inline: false,
    },
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: `
# Spinner

A common, animated component indicating that something is loading or waiting.  Originally
called a [throbber](https://en.wikipedia.org/wiki/Throbber).
`,
            },
        },
    },
};

export default metadata;

type Story = StoryObj;

const template: Story = {
    render: ({ size = "md", label = "Loading..." }) => html`
        <ak-spinner size="${size}" label="${label}"></ak-spinner>
    `,
};

export const Basic: Story = {
    ...template,
    args: {},
};

export const Small: Story = {
    ...template,
    args: {
        size: "sm",
    },
};

export const Large: Story = {
    ...template,
    args: {
        size: "lg",
    },
};

export const ExtraLarge: Story = {
    ...template,
    args: {
        size: "xl",
    },
};

export const CustomLabel: Story = {
    ...template,
    args: {
        label: "Reticulating splines at your request...",
    },
};

export const CustomColor = () => html`
    <div>
        <ak-spinner style="--pf-v5-c-spinner--Color: rebeccapurple;" size="xl"></ak-spinner>
        <ak-spinner
            style="--pf-v5-c-spinner--Color: hsl(327.57deg, 100.00%, 53.92%);"
            size="lg"
        ></ak-spinner>
        <ak-spinner
            style="--pf-v5-c-spinner--Color: oklch(0.54 0.0927 194.77);"
            size="xl"
        ></ak-spinner>
    </div>
`;

export const AllSizes = () => html`
    <main
        tabindex="0"
        aria-label="All sizes"
        style="display: flex; flex-direction: column; gap: 16px;"
    >
        <div>
            <h3>Small (sm)</h3>
            <ak-spinner size="sm"></ak-spinner>
        </div>
        <div>
            <h3>Medium (md) - Default</h3>
            <ak-spinner size="md"></ak-spinner>
        </div>
        <div>
            <h3>Large (lg)</h3>
            <ak-spinner size="lg"></ak-spinner>
        </div>
        <div>
            <h3>Extra Large (xl)</h3>
            <ak-spinner size="xl"></ak-spinner>
        </div>
    </main>
`;

export const InlineSpinners: Story = {
    parameters: {
        docs: {
            description: {
                story: "Inline spinners that scale with the surrounding text size.",
            },
        },
    },
    render: () => html`
        <main
            tabindex="0"
            aria-label="Inline spinners"
            style="display: flex; flex-direction: column; gap: 1rem;"
        >
            <div style="font-size: 14px;">
                Small text with <ak-spinner inline label="Loading small"></ak-spinner> inline
                spinner
            </div>
            <div style="font-size: 16px;">
                Normal text with <ak-spinner inline label="Loading normal"></ak-spinner> inline
                spinner
            </div>
            <div style="font-size: 20px;">
                Large text with <ak-spinner inline label="Loading large"></ak-spinner> inline
                spinner
            </div>
            <div style="font-size: 24px;">
                Extra large text with
                <ak-spinner inline label="Loading extra large"></ak-spinner> inline spinner
            </div>
        </main>
    `,
};

export const CustomAnimations: Story = {
    parameters: {
        docs: {
            description: {
                story: "Spinners with customized animation properties.",
            },
        },
    },
    render: () => html`
        <main
            tabindex="0"
            aria-label="Custom animations"
            style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;"
        >
            <div style="text-align: center;">
                <ak-spinner
                    size="lg"
                    style="--pf-v5-c-spinner--AnimationDuration: 0.8s;"
                ></ak-spinner>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">Fast (0.8s)</div>
            </div>
            <div style="text-align: center;">
                <ak-spinner size="lg"></ak-spinner>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">Default (1.4s)</div>
            </div>
            <div style="text-align: center;">
                <ak-spinner
                    size="lg"
                    style="--pf-v5-c-spinner--AnimationDuration: 2.5s;"
                ></ak-spinner>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">Slow (2.5s)</div>
            </div>
            <div style="text-align: center;">
                <ak-spinner
                    size="lg"
                    style="--pf-v5-c-spinner--stroke-width: 5; --pf-v5-c-spinner--Color: #6366f1;"
                ></ak-spinner>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">Thin stroke</div>
            </div>
            <div style="text-align: center;">
                <ak-spinner
                    size="lg"
                    style="--pf-v5-c-spinner--stroke-width: 15; --pf-v5-c-spinner--Color: #ec4899;"
                ></ak-spinner>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">Thick stroke</div>
            </div>
        </main>
    `,
};

export const LoadingStates: Story = {
    parameters: {
        docs: {
            description: {
                story: "Common loading state patterns with spinners.",
            },
        },
    },
    render: () => html`
        <main
            tabindex="0"
            aria-label="Loading states"
            style="display: flex; flex-direction: column; gap: 2rem;"
        >
            <!-- Page loading -->
            <section
                id="demo-region-1"
                style="text-align: center; padding: 3rem; border: 1px dashed #ccc; border-radius: 8px;"
                aria-busy="true"
                aria-live="polite"
                aria-label="Demo Region 1"
                aria-describedby="demo-region-1-description"
            >
                <ak-spinner size="xl"></ak-spinner>
                <div id="demo-region-1-description" style="margin-top: 1rem; color: #666;">
                    Loading page content...
                </div>
            </section>

            <!-- Card loading -->
            <section
                style="padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;"
                id="demo-region-1"
                aria-busy="true"
                aria-live="polite"
                aria-label="Demo Region 2"
                aria-describedby="demo-region-2-description"
            >
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <ak-spinner size="md"></ak-spinner>
                    <div id="demo-region-2-description">Loading card data...</div>
                </div>
            </section>

            <!-- List item loading -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div
                    style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 4px;"
                >
                    <ak-spinner size="sm" label="Loading item 1"></ak-spinner>
                    <div>Loading list item...</div>
                </div>
                <div
                    style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 4px;"
                >
                    <ak-spinner size="sm" label="Loading item 2"></ak-spinner>
                    <div>Loading list item...</div>
                </div>
            </div>
        </main>
    `,
};

export const UsingBuilderFunction: Story = {
    parameters: {
        docs: {
            description: {
                story: "Creating spinners programmatically using the akSpinner helper function.",
            },
        },
    },
    render: () => html`
        <main
            tabindex="0"
            aria-label="Using Builder Function"
            style="display: flex; flex-direction: column; gap: 1.5rem;"
        >
            <div>
                <h4>Basic spinner with builder:</h4>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    ${akSpinner()}
                    <span>Default spinner created with akSpinner()</span>
                </div>
            </div>

            <div>
                <h4>Custom size and label:</h4>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    ${akSpinner({ size: "lg", ariaLabel: "Processing data..." })}
                    <span>Large spinner with custom label</span>
                </div>
            </div>

            <div>
                <h4>Inline spinner:</h4>
                <p>
                    Processing your request ${akSpinner({ inline: true, ariaLabel: "Processing" })}
                    please wait...
                </p>
            </div>
        </main>
    `,
};

export const AccessibilityExample: Story = {
    parameters: {
        docs: {
            description: {
                story: "Demonstrating accessibility best practices with spinners.",
            },
        },
    },
    render: () => html`
            <main tabindex="0" aria-label="All sizes">
                <h4>Spinners with descriptive labels:</h4>
                <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                    <div style="text-align: center;">
                        <ak-spinner id="demo-accessibility-spinner-1" size="md" aria-label="Loading user profile data"></ak-spinner>
                        <div aria-busy="true" aria-describedby="demo-accessibility-spinner-1" style="margin-top: 0.5rem; font-size: 0.875rem;">User Profile</div>
                    </div>
                    <div style="text-align: center;">
                        <ak-spinner id="demo-accessibility-spinner-2" size="md" aria-label="Uploading document, please wait"></ak-spinner>
                        <div aria-busy="true" aria-describedby="demo-accessibility-spinner-2" style="margin-top: 0.5rem; font-size: 0.875rem;">File Upload</div>
                    </div>
                    <div style="text-align: center;">
                        <ak-spinner id="demo-accessibility-spinner-3" size="md" aria-label="Saving changes to database"></ak-spinner>
                        <div aria-busy="true" aria-describedby="demo-accessibility-spinner-3" style="margin-top: 0.5rem; font-size: 0.875rem;">Save Operation</div>
                    </div>
                </div>
            </div>

            <div style="padding: 1rem; background: #f3f4f6; border-radius: 8px;">
                <h4 style="margin-top: 0;">Accessibility Notes:</h4>
                <ul style="margin-bottom: 0;">
                    <li>Each spinner has a descriptive <code>aria-label</code> attribute</li>
                    <li>
                        The <code>role="progressbar"</code> indicates loading state to screen
                        readers
                    </li>
                    <li>Labels should describe what is being loaded, not just "Loading..."</li>
                    <li>Consider pairing with visually hidden text for additional context</li>
                </ul>
            </div>
        </main>
    `,
};
