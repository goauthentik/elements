import "./ak-badge.js";

import { AkBadgeProps } from "./ak-badge.builder.js";
import { Badge } from "./ak-badge.component.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

const meta: Meta<AkBadgeProps> = {
    title: "Components/Badge",
    component: "ak-badge",
    tags: ["autodocs"],

    parameters: {
        docs: {
            description: {
                component:
                    "A badge component for displaying status indicators, counts, or labels with read/unread states for accessibility.",
            },
        },
    },
    argTypes: {
        screenReaderText: {
            control: { type: "text" },
            description: "Additional text announced to screen readers but not visually displayed",
        },
        read: {
            control: { type: "boolean" },
            description: "Applies read state styling (gray background)",
        },
        unread: {
            control: { type: "boolean" },
            description: "Applies unread state styling (blue background with white text)",
        },
    },
    args: {
        read: false,
        unread: false,
    },
    decorators: [
        (story) => html`
            <div
                style="padding: 2rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;"
            >
                ${story()}
            </div>
        `,
    ],
};

export default meta;
type Story = StoryObj<Badge>;

// Default badge
export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: "Default badge with neutral styling.",
            },
        },
    },
    render: (args: AkBadgeProps) =>
        html`<ak-badge
            ?read=${args.read}
            ?unread=${args.unread}
            screen-reader-text=${ifDefined(args.screenReaderText)}
            >5</ak-badge
        >`,
};

// Number badges
export const Numbers: Story = {
    parameters: {
        docs: {
            description: {
                story: "Badges displaying various numbers and counts.",
            },
        },
    },
    render: () => html`
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <ak-badge>1</ak-badge>
            <ak-badge>12</ak-badge>
            <ak-badge>123</ak-badge>
            <ak-badge>1,234</ak-badge>
            <ak-badge>99+</ak-badge>
        </div>
    `,
};

// Read state
export const ReadState: Story = {
    parameters: {
        docs: {
            description: {
                story: "Badges with read state styling (gray background).",
            },
        },
    },
    render: () => html`
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <ak-badge read>3</ak-badge>
            <ak-badge read>Read</ak-badge>
            <ak-badge read>Viewed</ak-badge>
        </div>
    `,
};

// Unread state
export const UnreadState: Story = {
    parameters: {
        docs: {
            description: {
                story: "Badges with unread state styling (blue background with white text).",
            },
        },
    },
    render: () => html`
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <ak-badge unread>7</ak-badge>
            <ak-badge unread>New</ak-badge>
            <ak-badge unread>Unread</ak-badge>
        </div>
    `,
};

// Text content
export const TextContent: Story = {
    parameters: {
        docs: {
            description: {
                story: "Badges with text content instead of numbers.",
            },
        },
    },
    render: () => html`
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <ak-badge>New</ak-badge>
            <ak-badge>Hot</ak-badge>
            <ak-badge>Sale</ak-badge>
            <ak-badge>Beta</ak-badge>
            <ak-badge>Pro</ak-badge>
        </div>
    `,
};

// With screen reader text
export const WithScreenReaderText: Story = {
    parameters: {
        docs: {
            description: {
                story: "Badges with additional screen reader text for accessibility. Inspect the DOM to see the hidden text elements.",
            },
        },
    },
    render: () => html`
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <ak-badge screen-reader-text="5 unread messages">5</ak-badge>
            <ak-badge screen-reader-text="12 new notifications" unread>12</ak-badge>
            <ak-badge screen-reader-text="3 completed tasks" read>3</ak-badge>
        </div>
        <p style="margin-top: 1rem; font-size: 0.875rem; color: #666;">
            <em
                >Screen reader users will hear the additional descriptive text along with the badge
                content.</em
            >
        </p>
    `,
};

// Usage in context
export const InContext: Story = {
    parameters: {
        docs: {
            description: {
                story: "Badges used in typical UI contexts like navigation, lists, and buttons.",
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            <div>
                <h4 style="margin: 0 0 1rem 0;">Navigation with badges</h4>
                <nav style="display: flex; gap: 1rem;">
                    <span>Messages <ak-badge unread>3</ak-badge></span>
                    <span>Notifications <ak-badge>7</ak-badge></span>
                    <span>Archive <ak-badge read>12</ak-badge></span>
                </nav>
            </div>

            <div>
                <h4 style="margin: 0 0 1rem 0;">List items with counts</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li
                        style="padding: 0.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;"
                    >
                        <span>Inbox</span>
                        <ak-badge unread screen-reader-text="15 unread emails">15</ak-badge>
                    </li>
                    <li
                        style="padding: 0.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;"
                    >
                        <span>Drafts</span>
                        <ak-badge>3</ak-badge>
                    </li>
                    <li
                        style="padding: 0.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;"
                    >
                        <span>Sent</span>
                        <ak-badge read>127</ak-badge>
                    </li>
                </ul>
            </div>

            <div>
                <h4 style="margin: 0 0 1rem 0;">Buttons with status</h4>
                <div style="display: flex; gap: 1rem;">
                    <button
                        style="padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;"
                    >
                        Cart <ak-badge unread>2</ak-badge>
                    </button>
                    <button
                        style="padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;"
                    >
                        Wishlist <ak-badge>5</ak-badge>
                    </button>
                </div>
            </div>
        </div>
    `,
};

// State comparison
export const StateComparison: Story = {
    parameters: {
        docs: {
            description: {
                story: "Side-by-side comparison of all badge states with the same content.",
            },
        },
    },
    render: () => html`
        <div
            style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; text-align: center;"
        >
            <div>
                <h4 style="margin: 0 0 1rem 0;">Default</h4>
                <ak-badge>42</ak-badge>
                <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #666;">Neutral state</p>
            </div>
            <div>
                <h4 style="margin: 0 0 1rem 0;">Read</h4>
                <ak-badge read>42</ak-badge>
                <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #666;">
                    Acknowledged/seen
                </p>
            </div>
            <div>
                <h4 style="margin: 0 0 1rem 0;">Unread</h4>
                <ak-badge unread>42</ak-badge>
                <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #666;">
                    Requires attention
                </p>
            </div>
        </div>
    `,
};

// Edge cases
export const EdgeCases: Story = {
    parameters: {
        docs: {
            description: {
                story: "Edge cases including empty badges, long text, and special characters.",
            },
        },
    },
    render: () => html`
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <ak-badge>0</ak-badge>
            <ak-badge></ak-badge>
            <ak-badge>Very Long Text</ak-badge>
            <ak-badge>123456789</ak-badge>
            <ak-badge>★</ak-badge>
            <ak-badge>✓</ak-badge>
            <ak-badge>!</ak-badge>
        </div>
        <p style="margin-top: 1rem; font-size: 0.875rem; color: #666;">
            <em>Testing various content lengths and types to ensure consistent styling.</em>
        </p>
    `,
};

export const StylingWithCssParts: Story = {
    parameters: {
        docs: {
            description: {
                story: "Badges with text content instead of numbers.",
            },
        },
    },
    render: () => html`
        <style>
            .stylingwithcssparts ak-badge::part(badge) {
                background-color: limegreen;
            }
        </style>
        <div
            class="stylingwithcssparts"
            style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;"
        >
            <ak-badge>New</ak-badge>
            <ak-badge>Hot</ak-badge>
            <ak-badge>Sale</ak-badge>
            <ak-badge>Beta</ak-badge>
            <ak-badge>Pro</ak-badge>
        </div>
    `,
};

export const StylingWithCssProps: Story = {
    parameters: {
        docs: {
            description: {
                story: "Badges with text content instead of numbers.",
            },
        },
    },
    render: () => html`
        <style>
            @scope (.colorful) {
                ak-badge {
                    --pf-v5-global--BackgroundColor--200: cyan;
                    --pf-v5-global--primary-color--100: magenta;
                }
            }
        </style>
        <div
            class="colorful"
            style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;"
        >
            <ak-badge class="colorful" read>Read</ak-badge>
            <ak-badge class="colorful" unread>Unread</ak-badge>
        </div>
        <p>
            Although these come later, they're out of the scope of the styled block, and should be
            their normal colors.
        </p>
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <ak-badge read>Read</ak-badge>
            <ak-badge unread>Unread</ak-badge>
        </div>
    `,
};
