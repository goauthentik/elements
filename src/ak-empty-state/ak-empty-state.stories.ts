import "./ak-empty-state.js";
import "../ak-icon/ak-icon.js";

import { akEmptyState, EmptyState } from "./ak-empty-state.js";

import { Meta, StoryObj } from "@storybook/web-components";

import { html, nothing, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type StoryProps = Pick<Partial<EmptyState>, "textOnly" | "spinnerOnly" | "loading" | "size"> & {
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
  - Add \`spinner-only\` to show only the spinner (in which case, why aren't you using the spinner component)?

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
        textOnly: {
            control: "boolean",
            description:
                "When true, prevents the default icon from showing when no icon is provided",
        },
        spinnerOnly: {
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
        spinnerOnly: false,
        fullHeight: false,
        textOnly: false,
    },
    render: (args) => html`
        <ak-empty-state
            icon=${ifDefined(args.iconClass)}
            size=${ifDefined(args.size)}
            ?loading=${args.loading}
            ?spinner-only=${args.spinnerOnly}
            ?full-height=${args.fullHeight}
            ?text-only=${ifDefined(args.textOnly)}
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
        spinnerOnly: true,
    },
};

export const LoadingWithCustomMessage: Story = {
    ...Template,
    args: {
        size: "lg",
        loading: true,
        spinnerOnly: true,
        titleText: html`I <em>know</em> it's around here somewhere!`,
    },
};

// Empty State with custom icon
export const WithCustomIcon: Story = {
    ...Template,
    args: {
        icon: html`<ak-icon
            style="width: 3rem; height: 3rem;"
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
        <ak-empty-state text-only>
            <div slot="icon">
                <svg
                    style="width: 4rem; height: 4rem; display: inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                >
                    <g fill="currentColor">
                        <path d="M14 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2" />
                        <path
                            fill-rule="evenodd"
                            d="M15.086 6c1.26-1.26 3.414-.368 3.414 1.414V9h1.586c1.782 0 2.674 2.154 1.414 3.414l-1.793 1.793l-.037.036l3.456 5.847a4 4 0 0 0 4.08 1.914l12.58-2.027c1.63-.263 2.74 1.609 1.728 2.914c-.97 1.251-1.459 2.85-1.812 4.6C38.384 34.02 32.854 39.052 26 39.88V42h2.5v2H19v-2h5v-2c-5.414 0-10.21-2.607-13.107-6.608c-2.324-3.21-1.946-7.335-1.006-10.767l.495-1.805a7 7 0 0 0 .181-2.822L10.5 18H7.914C6.132 18 5.24 15.846 6.5 14.586zm5 5l-1.466 1.466l-.73-1.233a5 5 0 0 0-.307-.455c.275.142.586.222.917.222zM16.5 9c0 .334.082.65.227.926a4.55 4.55 0 0 0-1.894-.845L16.5 7.414zm-8.586 7l1.595-1.594q.06.312.168.624l.334.97zm3.654-1.622a2.548 2.548 0 0 1 4.601-2.127l5.236 8.857a6 6 0 0 0 6.119 2.87l12.148-1.957c-1.082 1.557-1.589 3.383-1.93 5.075a13.1 13.1 0 0 1-1.419 3.815a1 1 0 0 0-.247.222C34.183 33.513 31.378 35 28.264 35C22.654 35 18 30.136 18 24a1 1 0 0 0-2 0c0 7.12 5.432 13 12.264 13q.6 0 1.184-.06A14.4 14.4 0 0 1 24 38c-4.763 0-8.96-2.291-11.487-5.78c-1.766-2.439-1.6-5.773-.697-9.066l.495-1.806a9 9 0 0 0-.171-5.311z"
                            clip-rule="evenodd"
                        />
                    </g>
                </svg>
            </div>
            <h2 slot="title">Chicken!</h2>
            <p slot="body">
                "I dream of a better tomorrow where chickens can cross the road and not be
                questioned about their motives."
            </p>
            <div slot="actions">
                <button>Pluck The Bird</button>
            </div>
        </ak-empty-state>
    `,
};

// Empty State with no icon
export const NoIcon: Story = {
    ...Template,
    args: {
        textOnly: true,
        titleText: "No result found",
        bodyText: "No results match the filter criteria",
        primaryAction: html`<button>Clear filters</button>`,
    },
    ...describe("Empty State without any icon, using the text-only attribute."),
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
                <h3>Medium</h3>
                <ak-empty-state size="md">
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
                <h3>Large (Default)</h3>
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
                icon: html`<ak-icon slot="icon" icon="fa fa-beer"></ak-icon>`,
                title: "Hold My Beer",
                body: "I saw this in a cartoon once. I'm sure I can pull it off.",
                actions: html`<button slot="actions">Leave The Scene Immediately</button>`,
            })}
            ${akEmptyState({
                size: "sm",
                textOnly: true,
                title: html`<h3 slot="title">Without Icon</h3>`,
                body: html`<p slot="body">Created using the helper function with textOnly=true</p>`,
                actions: html`<button slot="actions">Action Button</button>`,
            })}
            ${akEmptyState({
                size: "lg",
                fullHeight: false,
                title: html`<h2 slot="title">Default Icon</h2>`,
                body: html`<p slot="body">
                    Using the default icon since none provided and textOnly=false
                </p>`,
                actions: html`<button slot="actions">Primary Action</button
                    ><button>Secondary Action</button>`,
                footer: html`<a href="#" slot="footer">Learn more about this state</a>`,
            })}
            ${akEmptyState({
                size: "lg",
                fullHeight: false,
                title: html`<h2 slot="title">AKIcon Token Usage</h2>`,
                icon: "fas fa-face-dizzy",
                body: html`<p slot="body">
                    What the empty state looks like if you pass an ak-icon token to ak-empty-state's
                    builder's
                    <kbd>icon</kbd> field.
                </p>`,
                actions: html`<button slot="actions">Primary Action</button
                    ><button>Secondary Action</button>`,
                footer: html`<a href="#" slot="footer">Learn more about this state</a>`,
            })}
            ${akEmptyState({
                size: "lg",
                fullHeight: false,
                title: "Just With Strings",
                icon: "fas fa-meteor",
                body: "Using the sweet meteor of doom to demonstrate what this looks like using mostly string arguments to the builder.",
                actions: html`<button slot="actions">Primary Action</button
                    ><button>Secondary Action</button>`,
                footer: "Nothing more need be said.",
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
