import "./ak-skip-to-content.js";

import { akSkipToContent, SkipToContent } from "./ak-skip-to-content.js";

import { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type StoryProps = Pick<Partial<SkipToContent>, "label"> & {
    hasTarget: boolean;
    customLabel: string;
};

const metadata: Meta<Partial<StoryProps>> = {
    title: "Elements / Skip To Content",
    component: "ak-skip-to-content",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: /* md */ `
The SkipToContent component provides an accessibility feature that allows keyboard users to quickly navigate to the main content of a page, bypassing navigation and other non-essential elements.

This component is typically placed as the first focusable element on a page. When a user presses Tab on page load, the skip link becomes visible and can be activated to scroll to the designated target element.

### Usage

The component requires a target element to be set programmatically via the \`targetElement\` property. This is typically done by the page routing code to ensure the target exists when the component is activated.

### Attributes

- **label**: Custom label for the skip link (defaults to localized "Skip to content")

### Accessibility

- Uses proper ARIA labeling
- Follows the standard skip link pattern used by GitHub and other major sites
- Only visible when focused, maintaining clean visual design
- Automatically scrolls to and focuses the target element
`,
            },
        },
        layout: "fullscreen",
    },
    argTypes: {
        hasTarget: {
            control: "boolean",
            description: "Whether to set a target element (for demo purposes)",
        },
        customLabel: {
            control: "text",
            description: "Custom label text",
        },
    },
    decorators: [
        (story) => html`
            <div style="min-height: 200vh;">
                <div style="padding: 1rem; border: 2px dashed #ccc; margin-bottom: 2rem;">
                    <p>
                        <strong>Instructions:</strong> Press Tab to see the skip link appear. Click it or press Enter to
                        jump to the target content below.
                    </p>
                </div>
                ${story()}
                <div
                    style="height: 50vh; background: #f5f5f5; display: flex; align-items: center; justify-content: center;"
                >
                    <p>Placeholder content area</p>
                </div>
                <div id="main-content" style="padding: 2rem; background: #e8f4fd; border: 2px solid #0066cc;">
                    <h2>Main Content</h2>
                    <p>This is the target content area. The skip link should scroll to this section and focus it.</p>
                    <p>
                        This demonstrates how users can bypass navigation and other page elements to quickly reach the
                        primary content.
                    </p>
                </div>
                <div
                    style="height: 100vh; background: #f9f9f9; display: flex; align-items: center; justify-content: center;"
                >
                    <p>More content below to demonstrate scrolling behavior</p>
                </div>
            </div>
        `,
    ],
};

export default metadata;

type Story = StoryObj<StoryProps>;

const describe = (story: string) => ({ parameters: { docs: { description: { story } } } });

// Helper to set up target element after render
const setupTarget = () => {
    setTimeout(() => {
        const skipComponent = document.querySelector("ak-skip-to-content") as SkipToContent;
        const targetElement = document.getElementById("main-content");
        if (skipComponent && targetElement) {
            // Make target focusable
            targetElement.setAttribute("tabindex", "-1");
            skipComponent.targetElement = targetElement;
        }
    }, 0);
};

const Template: Story = {
    args: {
        hasTarget: true,
        customLabel: "",
    },
    render: (args) => {
        if (args.hasTarget) {
            setupTarget();
        }

        return html` <ak-skip-to-content label=${ifDefined(args.customLabel || undefined)}></ak-skip-to-content> `;
    },
};

export const Default: Story = {
    ...Template,
    ...describe("Basic skip to content link with default label. Press Tab to reveal the skip link."),
};

export const CustomLabel: Story = {
    ...Template,
    args: {
        ...Template.args,
        customLabel: "Jump to main content",
    },
    ...describe("Skip link with custom label text."),
};
