import "./ak-icon.js";

import { akIcon, Icon } from "./ak-icon.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

const metadata: Meta<Icon> = {
    title: "Typography / Icons",
    component: "ak-icon",
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `
# Icon Component

The Icon component is for showing logos, icons, and icons.
                `,
            },
        },
        argTypes: {},
    },
};

export default metadata;

type Story = StoryObj<Icon>;

export const Default: StoryObj = {
    render: () =>
        html`<div style="width: 300px">
            <ak-icon icon="campground"></ak-icon>
        </div>`,
};
