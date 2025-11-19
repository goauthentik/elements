import "./ak-avatar.js";

import { akAvatar, Avatar } from "./ak-avatar.js";

import { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type StoryProps = Pick<Avatar, "src" | "alt" | "icon" | "initials"> & {
    size?: "sm" | "md" | "lg" | "xl";
    border?: "light" | "dark";
};

const metadata: Meta<Partial<StoryProps>> = {
    title: "Elements / Avatar",
    component: "ak-avatar",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: /* md */ `
The Avatar component displays a user's profile image in a circular or rounded container.
Attributes provide support for size variants and optional borders for different visual contexts.

### Attributes:

- **src**: URL of the avatar image
- **alt**: Alternative text for accessibility
- **size**: Size variant - "sm", "md" (default), "lg", or "xl"
- **border**: Border style - "light" or "dark"
- **fallback-text**: Text to display when image fails, like the user's initials. Limited to three characters.
- **fallback-icon**: Icon to display when image fails and no text provided
`,
            },
        },
        layout: "centered",
    },
    argTypes: {
        size: {
            control: "select",
            description: "Size of the avatar",
            options: ["sm", "md", "lg", "xl"],
        },
        border: {
            control: "select",
            description: "Border style",
            options: [null, "light", "dark"],
        },
        src: {
            control: "text",
            description: "Image URL",
        },
        icon: {
            control: "text",
            description: "Icon token",
        },
        initials: {
            control: "text",
            description: "Fallback initials",
        },
        alt: {
            control: "text",
            description: "Alternative text for accessibility",
        },
    },
};

export default metadata;

type Story = StoryObj<StoryProps>;

// Helper for description
const describe = (story: string) => ({ parameters: { docs: { description: { story } } } });

// Basic avatar with image
export const Basic: Story = {
    args: {
        src: "./ak-avatar/demo/theavatar.png",
        alt: "User avatar",
        size: "md",
    },
    render: (args) => html`
        <ak-avatar
            src=${ifDefined(args.src)}
            alt=${ifDefined(args.alt)}
            icon=${ifDefined(args.icon)}
            initials=${ifDefined(args.initials)}
        ></ak-avatar>
    `,
};

// Size variants showcase
export const SizeVariants: Story = {
    ...describe("Somepony shown in all available sizes."),
    render: () => html`
        <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
            <div style="text-align: center;">
                <ak-avatar
                    src="./ak-avatar/demo/theavatar.png"
                    alt="Small avatar"
                    size="sm"
                ></ak-avatar>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">Small</div>
            </div>

            <div style="text-align: center;">
                <ak-avatar
                    src="./ak-avatar/demo/theavatar.png"
                    alt="Medium avatar"
                    size="md"
                ></ak-avatar>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">Medium</div>
            </div>

            <div style="text-align: center;">
                <ak-avatar
                    src="./ak-avatar/demo/theavatar.png"
                    alt="Large avatar"
                    size="lg"
                ></ak-avatar>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">Large</div>
            </div>

            <div style="text-align: center;">
                <ak-avatar
                    src="./ak-avatar/demo/theavatar.png"
                    alt="Extra large avatar"
                    size="xl"
                ></ak-avatar>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">Extra Large</div>
            </div>
        </div>
    `,
};

// Border variants
export const BorderVariants: Story = {
    ...describe(
        "Somepony's avatar with light and dark borders. Use light borders on dark backgrounds and dark borders on light backgrounds.",
    ),
    render: () => html`
        <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
            <div style="text-align: center;">
                <ak-avatar
                    src="./ak-avatar/demo/theavatar.png"
                    alt="No border"
                    size="lg"
                ></ak-avatar>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">No border</div>
            </div>
            §
            <div
                style="text-align: center; background-color: #1a1a1a; padding: 1rem; border-radius: 0.5rem;"
            >
                <ak-avatar
                    src="./ak-avatar/demo/theavatar.png"
                    alt="Light border"
                    size="lg"
                    border="light"
                ></ak-avatar>
                <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #f5f5f5">Light border</p>
            </div>
            §
            <div style="text-align: center; padding: 1rem">
                <ak-avatar
                    src="./ak-avatar/demo/theavatar.png"
                    alt="Dark border"
                    size="lg"
                    border="dark"
                ></ak-avatar>
                <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #1a1a1a;">Dark border</p>
            </div>
        </div>
    `,
};

// Missing image (demonstrates need for fallback)
export const MissingImage: Story = {
    ...describe("When an image fails to load, the browser shows a broken image icon."),
    render: () => html`
        <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
            <div style="text-align: center;">
                <ak-avatar
                    src="https://invalid-url-that-will-fail.com/avatar.jpg"
                    alt="Broken image example"
                    size="lg"
                ></ak-avatar>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">Broken image</div>
            </div>
            §
            <div style="text-align: center;">
                <ak-avatar alt="No image provided" size="lg"></ak-avatar>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">No src attribute</div>
            </div>
            §
            <div style="text-align: center;">
                <ak-avatar alt="No image provided" initials="TLA" size="lg"></ak-avatar>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">Fall back to initials</div>
            </div>
            <div style="text-align: center;">
                <ak-avatar alt="No image provided" icon="fa fa-horse" size="lg"></ak-avatar>
                <div style="margin-top: 0.5rem; font-size: 0.875rem;">Fall back to icon</div>
            </div>
        </div>
    `,
};

// Using the helper function
export const HelperFunction: Story = {
    ...describe("Creating avatars programmatically using the akAvatar helper function."),
    render: () => html`
        <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
            ${akAvatar({
                src: "./ak-avatar/demo/theavatar.png",
                alt: "User 1",
                size: "sm",
            })}
            ${akAvatar({
                src: "./ak-avatar/demo/theavatar.png",
                alt: "User 2",
                size: "md",
                border: "light",
            })}
            ${akAvatar({
                src: "./ak-avatar/demo/theavatar.png",
                alt: "User 3",
                size: "lg",
            })}
        </div>
    `,
};
