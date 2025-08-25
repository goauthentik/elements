import "./ak-brand.js";

import { akBrand, Brand } from "./ak-brand.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

const metadata: Meta<Brand> = {
    title: "Application / Brand",
    component: "ak-brand",
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `
# Brand Component

The Brand component is for showing logos, brands, and icons.
                `,
            },
        },
        argTypes: {
            src: {
                control: "text",
                description: "The URL to the brand image",
                table: {
                    type: { summary: "string" },
                    defaultValue: { summary: "undefined" },
                },
            },
            alt: {
                control: "text",
                description: "Alternative text for the image (required for accessibility)",
                table: {
                    type: { summary: "string" },
                    defaultValue: { summary: "undefined" },
                },
            },
        },
    },
};

export default metadata;

type Story = StoryObj<Brand>;

export const Default: StoryObj = {
    args: {
        src: "/icon_inverse_brand.svg",
        alt: "authentik Security, Inc.",
    },
    render: ({ src, alt }) =>
        html`<div style="width: 300px">
            <ak-brand src="${ifDefined(src)}" alt="${ifDefined(alt)}"></ak-brand>
        </div>`,
};

export const WithCustomSize: Story = {
    args: {
        src: "/icon_inverse_brand.svg",
        alt: "authentik Security, Inc.",
    },
    render: (args) => html`
        <style>
            .custom-sized {
                --pf-v5-c-brand--Width: 100px;
                --pf-v5-c-brand--Height: 100px;
            }
        </style>
        <ak-brand class="custom-sized" src=${ifDefined(args.src)} alt=${ifDefined(args.alt)}></ak-brand>
    `,
};

export const ResponsiveSizing: Story = {
    args: {
        src: "/icon_inverse_brand.svg",
        alt: "Responsive Brand Logo",
    },
    render: (args) => html`
        <style>
            .responsive-brand {
                --pf-v5-c-brand--Width: 80px;
                --pf-v5-c-brand--Width-on-sm: 100px;
                --pf-v5-c-brand--Width-on-md: 120px;
                --pf-v5-c-brand--Width-on-lg: 140px;
                --pf-v5-c-brand--Width-on-xl: 160px;
                --pf-v5-c-brand--Width-on-2xl: 180px;
                --pf-v5-c-brand--Height: auto;
            }
            .demo-container {
                padding: 20px;
                border: 1px dashed #ccc;
                text-align: center;
            }
            .breakpoint-info {
                margin-top: 10px;
                font-size: 12px;
                color: #666;
            }
        </style>
        <div class="demo-container">
            <ak-brand class="responsive-brand" src=${ifDefined(args.src)} alt=${ifDefined(args.alt)}></ak-brand>
            <div class="breakpoint-info">
                Resize your browser to see responsive sizing:<br />
                80px (default) → 100px (≥576px) → 120px (≥768px) → 140px (≥992px) → 160px (≥1200px) → 180px (≥1450px)
            </div>
        </div>
    `,
};

export const UsingBuilderFunction: Story = {
    args: {
        src: "/icon_inverse_brand.svg",
        alt: "Built with helper function",
    },
    render: (args) => html`
        <div style="padding: 20px; border: 1px dashed #ccc; text-align: center;">
            <h4 style="margin-top: 0;">Created with akBrand() helper function</h4>
            ${akBrand({
                src: args.src,
                alt: args.alt,
            })}
            <p style="font-size: 12px; color: #666; margin-bottom: 0;">
                <code>akBrand({ src: "${args.src}", alt: "${args.alt}" })</code>
            </p>
        </div>
    `,
};
