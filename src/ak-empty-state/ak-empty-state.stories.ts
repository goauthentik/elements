import "./ak-empty-state.js";
import "../ak-icon/ak-icon.js";

import { akEmptyState, IEmptyState } from "./ak-empty-state.js";

import { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type StoryProps = IEmptyState & { fullHeight: boolean };

const metadata: Meta<Partial<StoryProps>> = {
    title: "Elements/Empty State",
    component: "ak-empty-state",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
The Empty State component is used when there is no data or content to display.
This can be used as a placeholder until content is available, or to indicate 
that no content will be available.
        `,
            },
        },
    },
    argTypes: {
        size: {
            control: "select",
            description: "Size variants",
            options: ["xs", "sm", "md", "lg", "xl"],
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        fullHeight: {
            control: "boolean",
            description: "When true, allows the empty state to fill the available vertical space",
            table: {
                type: { summary: "boolean" },
            },
        },
        noIcon: {
            control: "boolean",
            description: "When true, prevents the default icon from showing when no icon is provided",
            table: {
                type: { summary: "boolean" },
            },
        },
    },
    decorators: [(story) => html` <div style="padding: 1rem; max-width: 100%;">${story()}</div> `],
};

export default metadata;

type Story = StoryObj<StoryProps>;

// Basic Empty State with title only and default icon
export const Basic: Story = {
    args: {
        size: "",
        fullHeight: false,
        noIcon: false,
    },
    render: (args: StoryProps) => html`
        <ak-empty-state size=${ifDefined(args.size)} ?full-height=${args.fullHeight} ?no-icon=${args.noIcon}>
            <h2 slot="title">No results found</h2>
        </ak-empty-state>
    `,
};

// Basic Empty State with title only and default icon
export const Loading: Story = {
    args: {
        size: "",
        fullHeight: false,
        noIcon: false,
    },
    render: (args: StoryProps) => html`
        <ak-empty-state loading size=${ifDefined(args.size)} ?full-height=${args.fullHeight}>
            <h2 slot="title">Searching for trouble...</h2>
        </ak-empty-state>
    `,
};

// Empty State with custom icon
export const WithCustomIcon: Story = {
    args: {
        size: "",
        fullHeight: false,
        noIcon: false,
    },
    render: (args: StoryProps) => html`
        <ak-empty-state size=${ifDefined(args.size)} ?full-height=${args.fullHeight} ?no-icon=${args.noIcon}>
            <div slot="icon">
                <ak-icon icon="triangle-exclamation" effect="fade" variant="danger" size="xl"></ak-icon>
            </div>
            <h2 slot="title">No results found</h2>
        </ak-empty-state>
    `,
};

// Empty State with no icon
export const NoIcon: Story = {
    args: {
        noIcon: true,
    },
    parameters: {
        docs: {
            description: {
                story: "Empty State without any icon, using the no-icon attribute.",
            },
        },
    },
    render: (args: StoryProps) => html`
        <ak-empty-state size=${ifDefined(args.size)} ?full-height=${args.fullHeight} ?no-icon=${args.noIcon}>
            <h2 slot="title">No results found</h2>
            <p slot="body">No results match the filter criteria.</p>
            <div slot="actions">
                <button>Clear filters</button>
            </div>
        </ak-empty-state>
    `,
};

// Complete Empty State with all elements
export const Complete: Story = {
    args: {
        size: "",
        fullHeight: false,
        noIcon: false,
    },
    render: (args: StoryProps) => html`
        <ak-empty-state size=${ifDefined(args.size)} ?full-height=${args.fullHeight} ?no-icon=${args.noIcon}>
            <div slot="icon">
                <ak-icon icon="triangle-exclamation" variant="warning" size="xl"></ak-icon>
            </div>
            <h2 slot="title">No results found</h2>
            <p slot="body">No results match the filter criteria. Clear all filters and try again.</p>
            <div slot="actions">
                <button>Clear all filters</button>
            </div>
            <p slot="footer">Contact the administrator for more information</p>
        </ak-empty-state>
    `,
};

// Size Variants
export const SizeVariants: Story = {
    parameters: {
        docs: {
            description: {
                story: "Empty State component with different size variants.",
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            <div>
                <h3>Extra Small (xs)</h3>
                <ak-empty-state size="xs">
                    <h4 slot="title">No results found</h4>
                    <p slot="body">No results match the filter criteria.</p>
                    <div slot="actions">
                        <button>Clear filters</button>
                    </div>
                </ak-empty-state>
            </div>

            <div>
                <h3>Small</h3>
                <ak-empty-state size="sm">
                    <h3 slot="title">No results found</h3>
                    <p slot="body">No results match the filter criteria. Clear all filters and try again.</p>
                    <div slot="actions">
                        <button>Clear all filters</button>
                    </div>
                </ak-empty-state>
            </div>

            <div>
                <h3>Default (medium)</h3>
                <ak-empty-state>
                    <h2 slot="title">No results found</h2>
                    <p slot="body">No results match the filter criteria. Clear all filters and try again.</p>
                    <div slot="actions">
                        <button>Clear all filters</button>
                    </div>
                </ak-empty-state>
            </div>

            <div>
                <h3>Large</h3>
                <ak-empty-state size="lg">
                    <h2 slot="title">No results found</h2>
                    <p slot="body">No results match the filter criteria. Clear all filters and try again.</p>
                    <div slot="actions">
                        <button>Clear all filters</button>
                    </div>
                </ak-empty-state>
            </div>

            <div>
                <h3>Extra Large</h3>
                <ak-empty-state size="xl">
                    <h1 slot="title">No results found</h1>
                    <p slot="body">No results match the filter criteria. Clear all filters and try again.</p>
                    <div slot="actions">
                        <button>Clear all filters</button>
                    </div>
                </ak-empty-state>
            </div>
        </div>
    `,
};

// Using the helper function
export const HelperFunction: Story = {
    parameters: {
        docs: {
            description: {
                story: "Using the akEmptyState helper function to create empty states programmatically.",
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            ${akEmptyState({
                size: "sm",
                icon: html`<ak-icon icon="blueprint" size="xl"></ak-icon>`,
                title: html`<h3>With Custom Icon</h3>`,
                body: html`<p>Created using the helper function</p>`,
                actions: html`<button>Action Button</button>`,
            })}
            ${akEmptyState({
                size: "sm",
                noIcon: true,
                title: html`<h3>Without Icon</h3>`,
                body: html`<p>Created using the helper function with noIcon=true</p>`,
                actions: html`<button>Action Button</button>`,
            })}
            ${akEmptyState({
                size: "lg",
                fullHeight: false,
                title: html`<h2>Default Icon</h2>`,
                body: html`<p>Using the default icon since none provided and noIcon=false</p>`,
                actions: html`<button>Primary Action</button><button>Secondary Action</button>`,
                footer: html`<a href="#">Learn more about this state</a>`,
            })}
        </div>
    `,
};
