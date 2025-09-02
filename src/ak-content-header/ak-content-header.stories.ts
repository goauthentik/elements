import "./ak-content-header.js";

import { akContentHeader, ContentHeader } from "./ak-content-header.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { TemplateResult, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type ContentHeaderProps = ContentHeader & {
    breadcrumbs?: TemplateResult;
    iconSlot?: TemplateResult;
    title: string | TemplateResult;
    subtitle?: string | TemplateResult;
};

const metadata: Meta<ContentHeader> = {
    title: "Application / Content Header",
    component: "ak-content-header",
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: `
# ContentHeader Component

The ContentHeader component is a pre-styled component for page headers.
                `,
            },
        },
        argTypes: {
            iconClass: {
                control: "text",
                description: "Font Awesome icon class [family (fa, fas, far, fab) required]",
            },
            title: {
                control: "text",
                description: "Primary Title Text (for demo purposes)",
            },
            subtitle: {
                control: "text",
                description: "Subtitle Text (for demo purposes)",
            },
        },
    },
};

export default metadata;

type Story = StoryObj<ContentHeader>;

const Template: Story = {
    render: (args: ContentHeaderProps) => {
        const { icon, breadcrumbs, iconSlot, title, subtitle } = args;
        return html`<ak-content-header icon=${ifDefined(args.icon)}>
            ${args.breadcrumbs
                ? html`<span slot="breadcrumbs">${args.breadcrumbs}</span>`
                : nothing}
            ${args.iconSlot ? html`<span slot="icon">${args.iconSlot}</span>` : nothing}
            ${args.title ? html`<span slot="title">${args.title}</span>` : nothing}
            ${args.subtitle
                ? html`<span slot="subtitle">${args.subtitle}</span>`
                : nothing}</ak-content-header
        >`;
    },
};

export const Default: StoryObj = {
    ...Template,
    args: {
        title: "Welcome to authentik",
    },
};

export const Standard: StoryObj = {
    ...Template,
    args: {
        icon: "fas fa-table-cells-column-lock",
        title: "Welcome to authentik",
        subtitle: "Control your identity needs with a secure, flexible solution",
    },
};
