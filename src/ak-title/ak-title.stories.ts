import "./ak-title";

import { type Title, type TitleProps, titleSize } from "./ak-title.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { html, nothing, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type Renderable = string | TemplateResult;

type StoryArgs = TitleProps & {
    content?: Renderable;
    iconName?: string;
    iconSlot?: boolean;
};

const metadata: Meta<StoryArgs> = {
    title: "Elements/Title",
    component: "ak-title",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
# Title Component

A single line component for titles with optional icons and external links. The title text is bold by default and can be sized appropriately for different contexts.
`,
            },
        },
        layout: "padded",
    },
    argTypes: {
        size: {
            control: "select",
            options: titleSize,
            description: "Title size variant",
        },
        href: {
            control: "text",
            description: "URL for external link (shows link icon when provided)",
        },
        noAutoSlot: {
            control: "boolean",
            description: "Prevents automatic icon slotting",
        },
        content: {
            control: "text",
            description: "Title text content",
        },
        iconName: {
            control: "text",
            description: "Icon name for ak-icon (for demo purposes)",
        },
        iconSlot: {
            control: "boolean",
            description: "Whether to explicitly slot the icon (for demo purposes)",
        },
    },
};

export default metadata;

type Story = StoryObj<Title>;

const Template: Story = {
    args: {
        content: "Title Text",
    },
    render: (args) => html`
        <ak-title
            size=${ifDefined(args.size || undefined)}
            href=${ifDefined(args.href || undefined)}
            ?no-auto-slot=${args.noAutoSlot}
        >
            ${args.iconName
                ? // eslint-disable-next-line sonarjs/no-nested-conditional
                  html`<i class=${args.iconName} slot=${args.iconSlot ? "icon" : nothing}></i>`
                : nothing}
            ${args.content}
        </ak-title>
    `,
};

// Basic title - just text
export const Basic: Story = {
    ...Template,
    args: {
        content: "Basic Title",
    },
};

// Icon and title
export const WithIcon: Story = {
    ...Template,
    args: {
        content: "Settings",
        iconName: "fas fa-cog",
        iconSlot: true,
    },
};

// Title with auto-slotted icon
export const WithAutoSlottedIcon: Story = {
    ...Template,
    args: {
        content: "Home Page",
    },
    render: (args) => html`
        <ak-title
            size=${ifDefined(args.size || undefined)}
            href=${ifDefined(args.href || undefined)}
            ?no-auto-slot=${args.noAutoSlot}
            ><i class="fas fa-home"></i>
            ${args.content}
        </ak-title>
    `,
};

// Title and link
export const WithLink: Story = {
    ...Template,
    args: {
        content: "Summary Report",
        href: "/detailed-report",
    },
};

// Icon, title, and link
export const Complete: Story = {
    ...Template,
    args: {
        content: "User Profile",
        iconName: "fas fa-user",
        iconSlot: true,
        href: "/user/profile/detailed",
    },
};

// Size variants
export const SizeVariants: Story = {
    args: {},
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <ak-title size="xs">Extra Small Title (xs)</ak-title>
            <ak-title size="sm">Small Title (sm)</ak-title>
            <ak-title size="md">Medium Title (md) - Default</ak-title>
            <ak-title size="lg">Large Title (lg)</ak-title>
            <ak-title size="xl">Extra Large Title (xl)</ak-title>
            <ak-title size="2xl">2X Large Title (2xl)</ak-title>
            <ak-title size="3xl">3X Large Title (3xl)</ak-title>
            <ak-title size="4xl">4X Large Title (4xl)</ak-title>
        </div>
    `,
};

// FontAwesome icon support
export const WithFontAwesome: Story = {
    args: {},
    render: () => html`
        <ak-title>
            <i class="fas fa-star"></i>
            Featured Content
        </ak-title>
    `,
};

// No auto-slot example
export const NoAutoSlot: Story = {
    args: {},
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
                <h3>With auto-slot (default):</h3>
                <ak-title>
                    <i class="fas fa-bell"></i>
                    Notifications
                </ak-title>
            </div>
            <div>
                <h3>Without auto-slot:</h3>
                <ak-title no-auto-slot>
                    <ak-icon icon="bell"></ak-icon>
                    Notifications
                </ak-title>
            </div>
        </div>
    `,
};

// Responsive behavior
export const ResponsiveBehavior: Story = {
    args: {},
    render: () => html`
        <div style="width: 300px; border: 1px solid #ccc; padding: 1rem;">
            <ak-title href="/very-long-url-that-might-cause-overflow">
                <i class="fas fa-external-link-alt"></i>
                This is a very, very, very long title to show how ellipses work.
            </ak-title>
        </div>
    `,
};

// Multiple titles in hierarchy
export const TitleHierarchy: Story = {
    args: {},
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <ak-title size="4xl">
                <i class="fas fa-home"></i>
                Main Page Title
            </ak-title>
            <ak-title size="2xl">Section Header</ak-title>
            <ak-title size="lg" href="/subsection">
                <i class="fas fa-list"></i>
                Subsection Title
            </ak-title>
            <ak-title size="md">Card Title</ak-title>
            <ak-title size="sm">Small Detail Title</ak-title>
        </div>
    `,
};
