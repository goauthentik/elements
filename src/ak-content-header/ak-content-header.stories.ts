import "./ak-content-header.js";
import "../ak-icon/ak-icon.js";

import { ContentHeader } from "./ak-content-header.js";

import { Meta, StoryObj } from "@storybook/web-components";

import { html, nothing, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type StoryProps = Pick<Partial<ContentHeader>, "icon"> & {
    iconSlot?: TemplateResult;
    titleText: string | TemplateResult;
    subtitleText?: string | TemplateResult;
    containerWidth?: string;
};

const metadata: Meta<Partial<StoryProps>> = {
    title: "Elements / Content Header",
    component: "ak-content-header",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: /* md */ `
The ContentHeader component displays page or section titles with optional icons and subtitles.
It uses container queries to responsively show/hide secondary elements based on available space.

### Slots:

- **icon**: Custom icon content (takes precedence over icon attribute)
- **title**: The main heading text (required)
- **subtitle**: Optional descriptive text below the title

### Responsive Behavior:

The component uses container queries to hide the icon and subtitle when the container width
is below 360px. This ensures the title remains readable in constrained spaces.

### Attributes:

- **icon**: FontAwesome icon class name. Only used if icon slot is empty.

### Styling:

The component provides CSS parts for external styling:
- **content-header**: Main container
- **title-block**: Container for icon and title
- **icon**: Icon container
- **icon-content**: Icon element wrapper
- **title**: Title text container
- **subtitle**: Subtitle text container
`,
            },
        },
        layout: "padded",
    },
    argTypes: {
        icon: {
            control: "text",
            description: "FontAwesome icon class",
        },
        titleText: {
            control: "text",
            description: "Main heading text",
        },
        subtitleText: {
            control: "text",
            description: "Optional subtitle text",
        },
        containerWidth: {
            control: "select",
            options: ["300px", "360px", "400px", "600px", "100%"],
            description: "Container width (for testing responsive behavior)",
        },
    },
    decorators: [
        (story) => html`
            <div style="padding: 1rem">
                <style>
                    ak-content-header {
                        background-color: whitesmoke;
                    }</style
                >${story()}
            </div>
        `,
    ],
};

export default metadata;

type Story = StoryObj<StoryProps>;

const describe = (story: string) => ({ parameters: { docs: { description: { story } } } });

const Template: Story = {
    args: {
        titleText: "Page Title",
        containerWidth: "100%",
    },
    render: (args) => html`
        <div style="width: ${args.containerWidth}">
            <ak-content-header icon=${ifDefined(args.icon)}>
                ${args.iconSlot ? html`<span slot="icon">${args.iconSlot}</span>` : nothing}
                <span slot="title">${args.titleText}</span>
                ${args.subtitleText
                    ? html`<span slot="subtitle">${args.subtitleText}</span>`
                    : nothing}
            </ak-content-header>
        </div>
    `,
};

// Basic content header with title only
export const Basic: Story = {
    ...Template,
    args: {
        ...Template.args,
        titleText: "Dashboard",
    },
};

// With icon attribute
export const WithIcon: Story = {
    ...Template,
    args: {
        ...Template.args,
        icon: "fa fa-dashboard",
        titleText: "Welcome, authentik Default Admin",
        subtitleText: "General system status",
    },
};

// With custom icon slot
export const WithCustomIcon: Story = {
    ...Template,
    args: {
        ...Template.args,
        iconSlot: html`<ak-icon icon="fa fa-users" variant="primary" size="lg"></ak-icon>`,
        titleText: "Users",
        subtitleText: "Manage user accounts, roles, and permissions",
    },
};

// Long subtitle to test line clamping
export const LongSubtitle: Story = {
    ...Template,
    args: {
        ...Template.args,
        icon: "fa fa-chart-line",
        titleText: "Notification Transports",
        subtitleText:
            "Comprehensive analytics and reporting dashboard with detailed metrics, charts, graphs, and insights into your application's performance, user engagement, conversion rates, and business intelligence data that helps you make informed decisions about your product strategy and growth initiatives.",
    },
};

// Container query responsive behavior
export const ResponsiveBehavior: Story = {
    ...describe(
        "Demonstrates how the component adapts to different container widths. Icon and subtitle are hidden below 360px.",
    ),
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            <div>
                <h3>Narrow Container (300px) - Icon and subtitle hidden</h3>
                <div style="max-width: 300px; width: 300px;">
                    <ak-content-header icon="fa fa-warning">
                        <span slot="title">System Tasks</span>
                        <span slot="subtitle"
                            >Long-running operations which authentik executes in the
                            background.</span
                        >
                    </ak-content-header>
                </div>
            </div>

            <div>
                <h3>Breakpoint (360px) - Icon and subtitle appear</h3>
                <div style="max-width: 360px; width: 360px;">
                    <ak-content-header icon="fa fa-warning">
                        <span slot="title">System Tasks</span>
                        <span slot="subtitle"
                            >Long-running operations which authentik executes in the
                            background.</span
                        >
                    </ak-content-header>
                </div>
            </div>

            <div>
                <h3>Wide Container (600px) - Full layout</h3>
                <ak-content-header icon="fa fa-warning">
                    <span slot="title">System Tasks</span>
                    <span slot="subtitle"
                        >Long-running operations which authentik executes in the background.</span
                    >
                </ak-content-header>
            </div>
        </div>
    `,
};

// Without icon
export const NoIcon: Story = {
    ...Template,
    args: {
        ...Template.args,
        titleText: "Federation and Social login",
        subtitleText:
            "Sources of identities, which can either be synced into authentik's database, or can be used by users to authenticate and enroll themselves.",
    },
};

// Icon slot precedence over attribute
export const IconPrecedence: Story = {
    ...describe("When both icon attribute and icon slot are provided, the slot takes precedence."),
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
                <h4>Icon from attribute</h4>
                <ak-content-header icon="fa fa-cog">
                    <span slot="title">Blueprints</span>
                </ak-content-header>
            </div>

            <div>
                <h4>Icon from slot (overrides attribute)</h4>
                <ak-content-header icon="fa fa-cog">
                    <span slot="icon">🎯</span>
                    <span slot="title">Blueprints</span>
                </ak-content-header>
            </div>
        </div>
    `,
};

// Various title lengths
export const TitleVariations: Story = {
    ...describe("Testing different title lengths and content types."),
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <ak-content-header icon="fa fa-home">
                <span slot="title">Flows</span>
            </ak-content-header>

            <ak-content-header icon="fa fa-chart-bar">
                <span slot="title">Stages</span>
                <span slot="subtitle"
                    >Flows describe a chain of Stages to authenticate, enroll or recover a user.
                    Stages are chosen based on policies applied to them.</span
                >
            </ak-content-header>

            <ak-content-header icon="fa fa-database">
                <h1 slot="title">Some Really Long Title That We Never Use In Production</h1>
                <span slot="subtitle">Vibecoding Bingo, Sir!</span>
            </ak-content-header>

            <ak-content-header>
                <em slot="title">Styled Title Content</em>
                <span slot="subtitle">Supports <strong>HTML content</strong> in slots</span>
            </ak-content-header>
        </div>
    `,
};

// Edge cases
export const EdgeCases: Story = {
    ...describe("Testing edge cases and unusual content configurations."),
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
                <h4>Empty title slot</h4>
                <ak-content-header icon="fa fa-question">
                    <span slot="title"></span>
                </ak-content-header>
            </div>

            <div>
                <h4>Very long single-word title</h4>
                <div style="width: 300px; border: 1px dashed #999;">
                    <ak-content-header icon="fa fa-text">
                        <span slot="title">Supercalifragilisticexpialidocious</span>
                    </ak-content-header>
                </div>
            </div>

            <div>
                <h4>Complex icon slot content</h4>
                <ak-content-header>
                    <div slot="icon" style="display: flex; align-items: center; gap: 0.25rem;">
                        <ak-icon icon="fa fa-star" variant="warning"></ak-icon>
                        <span style="font-size: 0.75rem;">NEW</span>
                    </div>
                    <span slot="title">Initial Premissions</span>
                    <span slot="subtitle">Set initial permissions for newly created objects.</span>
                </ak-content-header>
            </div>
        </div>
    `,
};
