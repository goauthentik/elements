import "./ak-stack.js";

import { akStack } from "./ak-stack.js";

import { Meta, StoryObj } from "@storybook/web-components";

import { html, TemplateResult } from "lit";

type StoryProps = {
    wrap: boolean;
    gutter: "xs" | "sm" | "md" | "lg" | "xl";
    align: "start" | "end" | "center" | "baseline";
    children: TemplateResult | TemplateResult[] | string;
};

const metadata: Meta<Partial<StoryProps>> = {
    title: "Layout / Stack",
    component: "ak-stack",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: /* md */ `
The Stack is a vertical flex layout component that automatically arranges child elements in a column.
Child elements can be marked with the \`stack-fill\` attribute to make them grow to fill available space.
This component makes heavy use of slots, but it is not necessary for consumers of this component to
provide their own slot names; slot identities will be provided to the child components to place them correctly,
just as they would be in a standard vertical \`flex\` component.

- **wrap**: Allows items to wrap (less common in vertical layouts)
- **gutter**: Adds spacing between items. Uses t-shirt sizing: xs, sm, md, lg, xl. The default is "no gutter."
- **align**: Controls horizontal alignment of items within the stack (start, end, center, baseline)

### Child Attributes:

- **stack-fill**: Add this attribute to any child element to make it grow and fill available vertical space

### Common Use Cases:
- Page layouts with header/content/footer
- Sidebar navigation structures
- Card layouts with expandable content areas
- Modal dialogs and panels
`,
            },
        },
        layout: "padded",
    },
    argTypes: {
        wrap: {
            control: "boolean",
            description: "Allow items to wrap (uncommon for vertical layouts)",
        },
        gutter: {
            control: "select",
            options: [undefined, "xs", "sm", "md", "lg", "xl"],
            description: "Add vertical spacing between items",
        },
        align: {
            control: "select",
            options: [undefined, "start", "end", "center", "baseline"],
            description: "Horizontal alignment of items",
        },
    },
    decorators: [(story) => html` ${story()} `],
};

export default metadata;

type Story = StoryObj<StoryProps>;

const describe = (story: string) => ({ parameters: { docs: { description: { story } } } });

const defaultChildren = () => html`
    <div style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6;">Item 1</div>
    <div style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6;">Item 2</div>
    <div style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6;">Item 3</div>
`;

// Basic stack with multiple items
export const Basic: Story = {
    render: () => html` <ak-stack> ${defaultChildren()} </ak-stack> `,
};

// Stack with gutter spacing
export const WithGutter: Story = {
    ...describe("Stack with small gutter spacing between items."),
    render: () => html`
        <ak-stack gutter="sm">
            <div style="padding: 12px; background: #e3f2fd; border: 1px solid #1976d2;">
                Header Section
            </div>
            <div style="padding: 12px; background: #e3f2fd; border: 1px solid #1976d2;">
                Content Section
            </div>
            <div style="padding: 12px; background: #e3f2fd; border: 1px solid #1976d2;">
                Footer Section
            </div>
        </ak-stack>
    `,
};

// Stack with different gutter sizes
export const GutterSizes: Story = {
    ...describe("Comparing different gutter sizes for vertical spacing."),
    render: () => html`
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
            <div>
                <h4>Small (sm)</h4>
                <ak-stack gutter="sm">
                    <div style="padding: 8px; background: #fff3e0; border: 1px solid #f57c00;">
                        Item A
                    </div>
                    <div style="padding: 8px; background: #fff3e0; border: 1px solid #f57c00;">
                        Item B
                    </div>
                    <div style="padding: 8px; background: #fff3e0; border: 1px solid #f57c00;">
                        Item C
                    </div>
                </ak-stack>
            </div>

            <div>
                <h4>Medium (md)</h4>
                <ak-stack gutter="md">
                    <div style="padding: 8px; background: #e8f5e8; border: 1px solid #4caf50;">
                        Item A
                    </div>
                    <div style="padding: 8px; background: #e8f5e8; border: 1px solid #4caf50;">
                        Item B
                    </div>
                    <div style="padding: 8px; background: #e8f5e8; border: 1px solid #4caf50;">
                        Item C
                    </div>
                </ak-stack>
            </div>

            <div>
                <h4>Large (lg)</h4>
                <ak-stack gutter="lg">
                    <div style="padding: 8px; background: #fce4ec; border: 1px solid #e91e63;">
                        Item A
                    </div>
                    <div style="padding: 8px; background: #fce4ec; border: 1px solid #e91e63;">
                        Item B
                    </div>
                    <div style="padding: 8px; background: #fce4ec; border: 1px solid #e91e63;">
                        Item C
                    </div>
                </ak-stack>
            </div>
        </div>
    `,
};

// Stack with fill item (most important for vertical layouts)
export const WithFillItem: Story = {
    ...describe(
        "One item has the stack-fill attribute to grow and fill available vertical space - crucial for layout components.",
    ),
    render: () => html`
        <ak-stack gutter="sm">
            <div
                style="padding: 12px; background: #f5f5f5; border: 1px solid #999; text-align: center;"
            >
                Fixed Header
            </div>
            <div
                stack-fill
                style="padding: 20px; background: #ffebee; border: 1px solid #c62828; text-align: center; display: flex; align-items: center; justify-content: center;"
            >
                This content area fills available space
            </div>
            <div
                style="padding: 12px; background: #f5f5f5; border: 1px solid #999; text-align: center;"
            >
                Fixed Footer
            </div>
        </ak-stack>
    `,
};

// Page layout example
export const PageLayoutExample: Story = {
    ...describe("Classic page layout with header, main content, and footer using stack-fill."),
    render: () => html`
        <ak-stack style="height: 100%;">
            <header style="padding: 1rem; background: #1976d2; color: white; text-align: center;">
                Application Header
            </header>
            <main
                stack-fill
                style="padding: 2rem; background: #f8f9fa; display: flex; align-items: center; justify-content: center; text-align: center;"
            >
                <div>
                    <h2>Main Content Area</h2>
                    <p>This area expands to fill available space between header and footer.</p>
                </div>
            </main>
            <footer
                style="padding: 1rem; background: #424242; color: white; text-align: center; font-size: 0.875rem;"
            >
                © 2024 Application Footer
            </footer>
        </ak-stack>
    `,
};

// Sidebar layout
export const SidebarLayoutExample: Story = {
    ...describe("Sidebar navigation structure with expandable content area."),
    render: () => html`
        <ak-stack gutter="sm" style="width: 250px;">
            <div
                style="padding: 1rem; background: #3f51b5; color: white; text-align: center; font-weight: bold;"
            >
                Navigation
            </div>
            <nav style="padding: 0.5rem; background: #e8eaf6; border: 1px solid #c5cae9;">
                <ul style="list-style: none; margin: 0; padding: 0;">
                    <li style="padding: 0.5rem; border-bottom: 1px solid #c5cae9;">Dashboard</li>
                    <li style="padding: 0.5rem; border-bottom: 1px solid #c5cae9;">Users</li>
                    <li style="padding: 0.5rem; border-bottom: 1px solid #c5cae9;">Settings</li>
                </ul>
            </nav>
            <div
                stack-fill
                style="padding: 1rem; background: #f3e5f5; border: 1px solid #ba68c8; text-align: center; display: flex; align-items: center; justify-content: center;"
            >
                Expandable Content Area
            </div>
            <div
                style="padding: 0.5rem; background: #ede7f6; border: 1px solid #9575cd; text-align: center; font-size: 0.75rem;"
            >
                User: admin@example.com
            </div>
        </ak-stack>
    `,
};

// Card layout example
export const CardLayoutExample: Story = {
    ...describe("Card-like structure with fixed header/footer and expandable body content."),
    render: () => html`
        <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;"
        >
            <ak-stack
                style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; height: 300px;"
            >
                <div style="padding: 1rem; background: #2196f3; color: white; font-weight: bold;">
                    Card Title
                </div>
                <div
                    stack-fill
                    style="padding: 1rem; background: #f8f9fa; display: flex; align-items: center; justify-content: center; text-align: center;"
                >
                    <p>This is the main card content that expands to fill space.</p>
                </div>
                <div
                    style="padding: 0.5rem; background: #f5f5f5; border-top: 1px solid #ddd; text-align: center;"
                >
                    <button style="padding: 0.25rem 0.5rem;">Action</button>
                </div>
            </ak-stack>

            <ak-stack
                style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; height: 300px;"
            >
                <div style="padding: 1rem; background: #4caf50; color: white; font-weight: bold;">
                    Another Card
                </div>
                <div
                    stack-fill
                    style="padding: 1rem; background: #f1f8e9; display: flex; align-items: center; justify-content: center; text-align: center;"
                >
                    <p>Different content, same expandable behavior.</p>
                </div>
                <div
                    style="padding: 0.5rem; background: #f5f5f5; border-top: 1px solid #ddd; text-align: center;"
                >
                    <button style="padding: 0.25rem 0.5rem;">Action</button>
                </div>
            </ak-stack>
        </div>
    `,
};

// Modal dialog structure
export const ModalDialogExample: Story = {
    ...describe("Modal dialog structure with fixed header/footer and scrollable body."),
    render: () => html`
        <div
            style="background: rgba(0,0,0,0.5); padding: 2rem; display: flex; align-items: center; justify-content: center;"
        >
            <ak-stack
                style="width: 400px; height: 300px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"
            >
                <div
                    style="padding: 1rem; border-bottom: 1px solid #dee2e6; font-weight: bold; background: #f8f9fa;"
                >
                    Confirm Action
                </div>
                <div
                    stack-fill
                    style="padding: 1.5rem; overflow-y: auto; display: flex; align-items: center; justify-content: center; text-align: center;"
                >
                    <div>
                        <p>Are you sure you want to perform this action?</p>
                        <p>This content area can expand and scroll if needed.</p>
                    </div>
                </div>
                <div
                    style="padding: 1rem; border-top: 1px solid #dee2e6; background: #f8f9fa; display: flex; gap: 0.5rem; justify-content: flex-end;"
                >
                    <button
                        style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px;"
                    >
                        Cancel
                    </button>
                    <button
                        style="padding: 0.5rem 1rem; background: #dc3545; color: white; border: none; border-radius: 4px;"
                    >
                        Confirm
                    </button>
                </div>
            </ak-stack>
        </div>
    `,
};

// Alignment examples
export const AlignmentExamples: Story = {
    ...describe("Different horizontal alignment options for stack items."),
    render: () => html`
        <ak-stack gutter="xl">
            <div>
                <h4>Start Aligned</h4>
                <ak-stack
                    align="start"
                    gutter="sm"
                    style="display: block; border: 1px dashed #ccc; padding: 1rem;"
                >
                    <div
                        style="padding: 8px; background: #e3f2fd; border: 1px solid #1976d2; width: 120px;"
                    >
                        Short
                    </div>
                    <div
                        style="padding: 8px; background: #e3f2fd; border: 1px solid #1976d2; width: 200px;"
                    >
                        Medium Length
                    </div>
                    <div
                        style="padding: 8px; background: #e3f2fd; border: 1px solid #1976d2; width: 80px;"
                    >
                        Tiny
                    </div>
                </ak-stack>
            </div>

            <div>
                <h4>Center Aligned</h4>
                <ak-stack
                    align="center"
                    gutter="sm"
                    style="border: 1px dashed #ccc; display: block; padding: 1rem;"
                >
                    <div
                        style="padding: 8px; background: #fff3e0; border: 1px solid #f57c00; width: 120px;"
                    >
                        Short
                    </div>
                    <div
                        style="padding: 8px; background: #fff3e0; border: 1px solid #f57c00; width: 200px;"
                    >
                        Medium Length
                    </div>
                    <div
                        style="padding: 8px; background: #fff3e0; border: 1px solid #f57c00; width: 80px;"
                    >
                        Tiny
                    </div>
                </ak-stack>
            </div>

            <div>
                <h4>End Aligned</h4>
                <ak-stack
                    align="end"
                    gutter="sm"
                    style="border: 1px dashed #ccc; display: block; padding: 1rem;"
                >
                    <div
                        style="padding: 8px; background: #e8f5e8; border: 1px solid #4caf50; width: 120px;"
                    >
                        Short
                    </div>
                    <div
                        style="padding: 8px; background: #e8f5e8; border: 1px solid #4caf50; width: 200px;"
                    >
                        Medium Length
                    </div>
                    <div
                        style="padding: 8px; background: #e8f5e8; border: 1px solid #4caf50; width: 80px;"
                    >
                        Tiny
                    </div>
                </ak-stack>
            </div>
        </ak-stack>
    `,
};

// Using the helper function
export const HelperFunction: Story = {
    ...describe("Using the akStack helper function to create stacks programmatically."),
    render: () => html`
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem;">
            ${akStack(
                html`
                    <div
                        style="padding: 1rem; background: #e3f2fd; border: 1px solid #1976d2; text-align: center;"
                    >
                        Header
                    </div>
                    <div
                        stack-fill
                        style="padding: 2rem; background: #ffebee; border: 1px solid #c62828; text-align: center; display: flex; align-items: center; justify-content: center;"
                    >
                        Expanding Content
                    </div>
                    <div
                        style="padding: 0.5rem; background: #e8f5e8; border: 1px solid #4caf50; text-align: center;"
                    >
                        Footer
                    </div>
                `,
                { gutter: "sm", align: "center" },
            )}
            ${akStack(
                html`
                    <div
                        style="padding: 0.5rem; background: #f3e5f5; border: 1px solid #9c27b0; font-weight: bold;"
                    >
                        Navigation Panel
                    </div>
                    <div
                        stack-fill
                        style="padding: 1rem; background: #fff8e1; border: 1px solid #ffc107; min-height: 100px; display: flex; align-items: center; justify-content: center;"
                    >
                        Dynamic Content Area
                    </div>
                `,
                { gutter: "md" },
            )}
        </div>
    `,
};

// Complex nested layout
export const NestedLayoutExample: Story = {
    ...describe("Complex layout combining multiple stacks for real-world application structure."),
    render: () => html`
        <ak-stack style="height: 100%; border: 2px solid #333;">
            <!-- App Header -->
            <div
                style="padding: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center;"
            >
                <h3 style="margin: 0;">Application Dashboard</h3>
            </div>

            <!-- Main Content Area -->
            <ak-stack stack-fill gutter="lg" style="padding: 1.5rem; background: #f8f9fa;">
                <div style="text-align: center;">
                    <h2 style="margin: 0 0 0.5rem 0;">Welcome Back!</h2>
                    <p style="margin: 0; color: #6c757d;">
                        Here's what's happening in your dashboard today.
                    </p>
                </div>

                <!-- Stats Cards -->
                <div
                    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;"
                >
                    <ak-stack
                        style="padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                    >
                        <div style="font-size: 0.875rem; color: #6c757d; margin-bottom: 0.5rem;">
                            Total Users
                        </div>
                        <div style="font-size: 2rem; font-weight: bold; color: #28a745;">1,234</div>
                    </ak-stack>

                    <ak-stack
                        style="padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                    >
                        <div style="font-size: 0.875rem; color: #6c757d; margin-bottom: 0.5rem;">
                            Active Sessions
                        </div>
                        <div style="font-size: 2rem; font-weight: bold; color: #17a2b8;">456</div>
                    </ak-stack>

                    <ak-stack
                        style="padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                    >
                        <div style="font-size: 0.875rem; color: #6c757d; margin-bottom: 0.5rem;">
                            Revenue
                        </div>
                        <div style="font-size: 2rem; font-weight: bold; color: #ffc107;">
                            $12.3k
                        </div>
                    </ak-stack>
                </div>
            </ak-stack>

            <!-- App Footer -->
            <div
                style="padding: 0.75rem; background: #343a40; color: #adb5bd; text-align: center; font-size: 0.875rem;"
            >
                © 2025 Authentik Security, Inc. All rights reserved.
            </div>
        </ak-stack>
    `,
};
