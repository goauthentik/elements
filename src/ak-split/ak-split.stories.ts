import "./ak-split.js";

import { akSplit } from "./ak-split.js";

import { Meta, StoryObj } from "@storybook/web-components";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type StoryProps = {
    wrap: boolean;
    gutter: "xs" | "sm" | "md" | "lg" | "xl";
    align: "start" | "end" | "center" | "baseline";
    children: TemplateResult | TemplateResult[] | string;
};

const metadata: Meta<Partial<StoryProps>> = {
    title: "Layout / Split",
    component: "ak-split",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: /* md */ `
The Split is a horizontal flex layout component that automatically arranges child elements in a row.
Child elements can be marked with the \`split-fill\` attribute to make them grow to fill available space.
This component makes heavy use of slots, but it is not necessary for consumers of this component to
provide their own slot names; slot identities will be provided to the child components to place them correctly,
just as they would be in a standard \`flex\` component.

- **wrap**: Allows items to wrap to the next line when space is limited
- **gutter**: Adds spacing between items. Uses t-shirt sizing: xs, sm, md, lg, xl.  The default is "no gutter," and just adding \`gutter\` as a boolean triggers \`md\` sizing.

### Child Attributes:

- **split-fill**: Add this attribute to any child element to make it grow and fill available space

`,
            },
        },
        layout: "padded",
    },
    argTypes: {
        wrap: {
            control: "boolean",
            description: "Allow items to wrap to the next line",
        },
        gutter: {
            control: "select",
            options: [undefined, "xs", "sm", "md", "lg", "xl"],
            description: "Add spacing between items",
        },
        align: {
            control: "select",
            options: [undefined, "start", "end", "center", "baseline"],
            description: "How the items align along the row",
        },
    },
    decorators: [
        (story) => html`
            <div style="padding: 1rem; border: 1px dashed #ccc; min-height: 200px;">${story()}</div>
        `,
    ],
};

export default metadata;

type Story = StoryObj<StoryProps>;

const describe = (story: string) => ({ parameters: { docs: { description: { story } } } });

const defaultChildren = () => html`
    <div style="padding: 8px; background: cornsilk; border: 1px solid silver;">Item 1</div>
    <div style="padding: 8px; background: cornsilk; border: 1px solid silver;">Item 2</div>
    <div style="padding: 8px; background: cornsilk; border: 1px solid silver;">Item 3</div>
`;

const Template: Story = {
    render: (args: Partial<StoryProps>) => html`
        <ak-split
            ?wrap=${!!args.wrap}
            gutter=${ifDefined(args.gutter)}
            align=${ifDefined(args.align)}
        >
            ${args.children ? args.children : defaultChildren()}
        </ak-split>
    `,
};

// Basic split with multiple items
export const Basic: Story = {
    ...Template,
};

// Split with gutter spacing
export const WithGutter: Story = {
    ...describe("Split with small gutter spacing between items."),
    render: () => html`
        <style>
            .demo-div {
                padding: 8px;
                background: #e6f3ff;
                border: 1px solid #007acc;
            }
        </style>
        <ak-split gutter="sm">
            <div class="demo-div">First Item</div>
            <div class="demo-div">Second Item</div>
            <div class="demo-div">Third Item</div>
            <div class="demo-div">Fourth Item</div>
        </ak-split>
    `,
};

// Split with medium gutter
export const WithMediumGutter: Story = {
    ...describe("Split with medium gutter spacing for more breathing room."),
    render: () => html`
        <style>
            .demo-div {
                padding: 12px;
                background: #fff2e6;
                border: 1px solid #ff8c00;
            }
        </style>
        <ak-split gutter="md">
            <div class="demo-div">Item A</div>
            <div class="demo-div">Item B</div>
            <div class="demo-div">Item C</div>
        </ak-split>
    `,
};

// Split with fill item
export const WithFillItem: Story = {
    ...describe("One item has the split-fill attribute to grow and fill available space."),
    render: () => html`
        <ak-split gutter="sm">
            <div style="padding: 8px; background: #f0f0f0; border: 1px solid #999;">Start</div>
            <div
                split-fill
                style="padding: 8px; background: #ffe6e6; border: 1px solid #cc0000; text-align: center;"
            >
                This item fills available space
            </div>
            <div style="padding: 8px; background: #f0f0f0; border: 1px solid #999;">End</div>
        </ak-split>
    `,
};

// Split with multiple fill items
export const WithMultipleFillItems: Story = {
    ...describe("Multiple items with split-fill share the available space equally."),
    render: () => html`
        <ak-split gutter="sm">
            <div style="padding: 8px; background: #f0f0f0; border: 1px solid #999;">Fixed</div>
            <div
                split-fill
                style="padding: 8px; background: #e6ffe6; border: 1px solid #00cc00; text-align: center;"
            >
                Fill Item 1
            </div>
            <div
                split-fill
                style="padding: 8px; background: #ffe6ff; border: 1px solid #cc00cc; text-align: center;"
            >
                Fill Item 2
            </div>
            <div style="padding: 8px; background: #f0f0f0; border: 1px solid #999;">Fixed</div>
        </ak-split>
    `,
};

// Split with wrap
export const WithWrap: Story = {
    ...describe("Items wrap to the next line when there isn't enough horizontal space."),
    render: () => html`
        <div style="width: 300px; border: 2px solid #ccc; padding: 8px;">
            <ak-split wrap gutter="sm">
                <div
                    style="padding: 8px; background: #f0f8ff; border: 1px solid #ccc; min-width: 80px;"
                >
                    Item 1
                </div>
                <div
                    style="padding: 8px; background: #f0f8ff; border: 1px solid #ccc; min-width: 80px;"
                >
                    Item 2
                </div>
                <div
                    style="padding: 8px; background: #f0f8ff; border: 1px solid #ccc; min-width: 80px;"
                >
                    Item 3
                </div>
                <div
                    style="padding: 8px; background: #f0f8ff; border: 1px solid #ccc; min-width: 80px;"
                >
                    Item 4
                </div>
                <div
                    style="padding: 8px; background: #f0f8ff; border: 1px solid #ccc; min-width: 80px;"
                >
                    Item 5
                </div>
            </ak-split>
        </div>
    `,
};

// Toolbar example
export const ToolbarExample: Story = {
    ...describe(
        "Typical toolbar layout with actions on the left and right sides.  This example is illustrative: this is two nested splits inside the one that defines the row, and the searchbar is correctly aligned using the `align` attribute.",
    ),
    render: () => html`
        <ak-split gutter="sm">
            <ak-split gutter="sm">
                <button style="padding: 6px 12px;">New</button>
                <button style="padding: 6px 12px;">Edit</button>
                <button style="padding: 6px 12px;">Delete</button>
            </ak-split>
            <div split-fill></div>
            <ak-split gutter="sm" align="center">
                <input type="search" placeholder="Search..." style="padding: 4px 8px;" />
                <button style="padding: 6px 12px;">Filter</button>
            </ak-split>
        </ak-split>
    `,
};

// Form layout example
export const FormLayoutExample: Story = {
    ...describe("Form field layout with label and expanding input."),
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <ak-split gutter="sm">
                <label style="padding: 8px; min-width: 100px; font-weight: bold;">Name:</label>
                <input
                    split-fill
                    type="text"
                    placeholder="Enter your name"
                    style="padding: 6px; border: 1px solid #ccc;"
                />
            </ak-split>

            <ak-split gutter="sm">
                <label style="padding: 8px; min-width: 100px; font-weight: bold;">Email:</label>
                <input
                    split-fill
                    type="email"
                    placeholder="Enter your email"
                    style="padding: 6px; border: 1px solid #ccc;"
                />
            </ak-split>

            <ak-split gutter="sm">
                <label style="padding: 8px; min-width: 100px; font-weight: bold;">Message:</label>
                <textarea
                    split-fill
                    placeholder="Enter your message"
                    rows="3"
                    style="padding: 6px; border: 1px solid #ccc; resize: vertical;"
                ></textarea>
            </ak-split>
        </div>
    `,
};

// Using the helper function
export const HelperFunction: Story = {
    ...describe("Using the akSplit helper function to create splits programmatically."),
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${akSplit(
                html`
                    <div style="padding: 8px; background: #e6f3ff; border: 1px solid #007acc;">
                        Helper Item 1
                    </div>
                    <div
                        split-fill
                        style="padding: 8px; background: #ffe6e6; border: 1px solid #cc0000; text-align: center;"
                    >
                        Fill Item
                    </div>
                    <div style="padding: 8px; background: #e6f3ff; border: 1px solid #007acc;">
                        Helper Item 3
                    </div>
                `,
                { gutter: "sm" },
            )}
            ${akSplit(
                html`
                    <button style="padding: 6px 12px;">Action 1</button>
                    <button style="padding: 6px 12px;">Action 2</button>
                    <div split-fill></div>
                    <button style="padding: 6px 12px;">Settings</button>
                `,
                { gutter: "md" },
            )}
        </div>
    `,
};

// Responsive behavior demonstration
export const ResponsiveBehavior: Story = {
    ...describe("Demonstrating how split behaves at different container widths."),
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            <div>
                <h4>Wide container (no wrap needed):</h4>
                <div style="width: 100%; border: 1px solid #ccc; padding: 8px;">
                    <ak-split wrap gutter="sm">
                        <div style="padding: 8px; background: #f0f8ff; border: 1px solid #ccc;">
                            Item 1
                        </div>
                        <div style="padding: 8px; background: #f0f8ff; border: 1px solid #ccc;">
                            Item 2
                        </div>
                        <div style="padding: 8px; background: #f0f8ff; border: 1px solid #ccc;">
                            Item 3
                        </div>
                    </ak-split>
                </div>
            </div>

            <div>
                <h4>Narrow container (items will wrap):</h4>
                <div style="width: 200px; border: 1px solid #ccc; padding: 8px;">
                    <ak-split wrap gutter="sm">
                        <div style="padding: 8px; background: #f0f8ff; border: 1px solid #ccc;">
                            Item 1
                        </div>
                        <div style="padding: 8px; background: #f0f8ff; border: 1px solid #ccc;">
                            Item 2
                        </div>
                        <div style="padding: 8px; background: #f0f8ff; border: 1px solid #ccc;">
                            Item 3
                        </div>
                    </ak-split>
                </div>
            </div>
        </div>
    `,
};
