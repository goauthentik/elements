import "./ak-empty-state.js";
import "../ak-icon/ak-icon.js";

import { akEmptyState, EmptyState } from "./ak-empty-state.js";

import { Meta, StoryObj } from "@storybook/web-components";

import { html, nothing, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type StoryProps = Pick<Partial<EmptyState>, "noIcon" | "noLoadingMessage" | "loading" | "size"> & {
    fullHeight: boolean;
    icon: TemplateResult;
    iconClass: string;
    titleText: string | TemplateResult;
    bodyText: string | TemplateResult;
    primaryAction: string | TemplateResult;
};

const metadata: Meta<Partial<StoryProps>> = {
    title: "Elements / Empty State",
    component: "ak-empty-state",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: /* md */ `
The EmptyState is an in-page element to indicate that something is either loading or unavailable.
When "loading" is true it displays a spinner, otherwise it displays a static icon. The default
icon is a question mark in a circle.

### Slots:

- **icon**: The icon to show.
- **title**: The title (renders larger and more bold)
- **body**: Any text to describe the state
- **primary**: Action buttons or other interactive elements
- **footer**: Anything you want under the action buttons.

For the loading attributes:

- The attribute \`loading\` will show the spinner and the default (localized) title of "Loading".
  - Add \`no-loading-message\` to show only the spinner (in which case, why aren't you using the spinner component)?

### Attributes:

- **icon**: The full class name of a FontAwesome or Patternfly icon.  Passed to the ak-icon \`icon\` attribute.
  If both this attribute is set and content is supplied to the \`icon\` slot, the slot takes precedence.
- **size**: one of "xs", "sm", "md", "lg" (default), or "xl"

If either of these attributes is active and the element contains content assigned to the icon or title
slots, the slotted content takes precendence.
`,
            },
        },
        layout: "padded",
    },
    argTypes: {
        size: {
            control: "select",
            description: "Size variants",
            options: ["xs", "sm", "md", "lg", "xl"],
        },
        fullHeight: {
            control: "boolean",
            description: "When true, allows the empty state to fill the available vertical space",
        },
        noIcon: {
            control: "boolean",
            description:
                "When true, prevents the default icon from showing when no icon is provided",
        },
        noLoadingMessage: {
            control: "boolean",
            description: "When loading and true, do not show the default label.",
        },
        iconClass: {
            control: "text",
            description: "Font Awesome icon class [family (fa, fas, far, fab) required]",
        },
        titleText: {
            control: "text",
            description: "Text for heading slot (for demo purposes)",
        },
        bodyText: {
            control: "text",
            description: "Text for body slot (for demo purposes)",
        },
        primaryAction: {
            control: "text",
            description: "Text for primary button (for demo purposes)",
        },
        footerText: {
            control: "text",
            description: "Text for footer slot (for demo purposes)",
        },
    },
    decorators: [(story) => html` <div style="padding: 1rem; max-width: 100%;">${story()}</div> `],
};

export default metadata;

type Story = StoryObj<StoryProps>;

const describe = (story: string) => ({ parameters: { docs: { description: { story } } } });

const Template: Story = {
    args: {
        iconClass: "far fa-folder-open",
        size: "lg",
        loading: false,
        noLoadingMessage: false,
        fullHeight: false,
        noIcon: false,
    },
    render: (args) => html`
        <ak-empty-state
            icon=${ifDefined(args.iconClass)}
            size=${ifDefined(args.size)}
            ?loading=${args.loading}
            ?no-loading-message=${args.noLoadingMessage}
            ?full-height=${args.fullHeight}
            ?no-icon=${ifDefined(args.noIcon)}
        >
            ${args.icon ? html`<div slot="icon">${args.icon}</div>` : nothing}
            ${args.titleText ? html`<span slot="title">${args.titleText}</span>` : nothing}
            ${args.bodyText ? html`<span slot="body">${args.bodyText}</span>` : nothing}
            ${args.primaryAction
                ? html`<span slot="actions">${args.primaryAction}</span>`
                : nothing}
            ${args.footerText ? html`<span slot="footer">${args.footerText}</span>` : nothing}
        </ak-empty-state>
    `,
};

// Basic Empty State with title only and default icon
export const Basic: Story = {
    ...Template,
    args: {
        ...Template.args,
        titleText: "No results found.",
    },
};

export const Empty: Story = {
    ...describe("Note that a completely empty &lt;ak-empty-state&gt; just shows the default icon."),
    render: () => html` <ak-empty-state></ak-empty-state>`,
};

// Basic Empty State with title only and default icon
export const Loading: Story = {
    ...Template,
    args: {
        size: "lg",
        loading: true,
    },
};

export const LoadingWithNoMessage: Story = {
    ...Template,
    args: {
        size: "lg",
        loading: true,
        noLoadingMessage: true,
    },
};

export const LoadingWithCustomMessage: Story = {
    ...Template,
    args: {
        size: "lg",
        loading: true,
        noLoadingMessage: true,
        titleText: html`I <em>know</em> it's around here somewhere!`,
    },
};

// Empty State with custom icon
export const WithCustomIcon: Story = {
    ...Template,
    args: {
        icon: html`<ak-icon
            icon="triangle-exclamation"
            effect="fade"
            variant="danger"
            size="xl"
        ></ak-icon>`,
        titleText: `No results found`,
    },
};

export const WithRawSvgIcon: Story = {
    render: () => html`
        <ak-empty-state no-icon>
            <div slot="icon">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2L1 21h22L12 2z" />
                </svg>
            </div>
            <h2 slot="title">No results found</h2>
            <p slot="body">
                No results match the filter criteria. Clear all filters and try again.
            </p>
            <div slot="actions">
                <button>Clear all filters</button>
            </div>
        </ak-empty-state>
    `,
};

// Empty State with no icon
export const NoIcon: Story = {
    ...Template,
    args: {
        noIcon: true,
        titleText: "No result found",
        bodyText: "No results match the filter criteria",
        primaryAction: html`<button>Clear filters</button>`,
    },
    ...describe("Empty State without any icon, using the no-icon attribute."),
};

// Complete Empty State with all elements
export const Complete: Story = {
    ...Template,
    args: {
        icon: html`<ak-icon icon="triangle-exclamation" variant="warning" size="xl"></ak-icon>`,
        titleText: "Have they got a chance?",
        bodyText: "Eh. It would take a miracle.",
        primaryAction: html`<button>Storm the castle</button>`,
        footerText: "Contact your administrator for more information.",
    },
};

// Size Variants
export const SizeVariants: Story = {
    ...describe("Empty State component with different size variants."),
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
                    <p slot="body">
                        No results match the filter criteria. Clear all filters and try again.
                    </p>
                    <div slot="actions">
                        <button>Clear all filters</button>
                    </div>
                </ak-empty-state>
            </div>

            <div>
                <h3>Default (large)</h3>
                <ak-empty-state>
                    <h2 slot="title">No results found</h2>
                    <p slot="body">
                        No results match the filter criteria. Clear all filters and try again.
                    </p>
                    <div slot="actions">
                        <button>Clear all filters</button>
                    </div>
                </ak-empty-state>
            </div>

            <div>
                <h3>Large</h3>
                <ak-empty-state size="lg">
                    <h2 slot="title">No results found</h2>
                    <p slot="body">
                        No results match the filter criteria. Clear all filters and try again.
                    </p>
                    <div slot="actions">
                        <button>Clear all filters</button>
                    </div>
                </ak-empty-state>
            </div>

            <div>
                <h3>Extra Large</h3>
                <ak-empty-state size="xl">
                    <h1 slot="title">No results found</h1>
                    <p slot="body">
                        No results match the filter criteria. Clear all filters and try again.
                    </p>
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
    ...describe("Using the akEmptyState helper function to create empty states programmatically."),
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            ${akEmptyState({
                icon: html`<ak-icon icon="fa fa-beer"></ak-icon>`,
                title: "Hold My Beer",
                body: "I saw this in a cartoon once. I'm sure I can pull it off.",
                actions: html`<button>Leave The Scene Immediately</button>`,
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

export const IconShowcase: Story = {
    args: {},
    render: () => html`
        <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;"
        >
            <ak-empty-state icon="fa-users">
                <span>Users</span>
                <span slot="body">Polycules not supported</span>
            </ak-empty-state>

            <ak-empty-state icon="fa-database">
                <span>Database</span>
                <span slot="body">No records</span>
            </ak-empty-state>

            <ak-empty-state icon="fa-envelope">
                <span>Messages</span>
                <span slot="body">No messages</span>
            </ak-empty-state>

            <ak-empty-state icon="fa-chart-bar">
                <span>Analytics</span>
                <span slot="body">No data to display</span>
            </ak-empty-state>

            <ak-empty-state icon="fa-cog">
                <span>Settings</span>
                <span slot="body">No configuration</span>
            </ak-empty-state>

            <ak-empty-state icon="fa-shield-alt">
                <span>Security</span>
                <span slot="body">No alerts</span>
            </ak-empty-state>
        </div>
    `,
};
