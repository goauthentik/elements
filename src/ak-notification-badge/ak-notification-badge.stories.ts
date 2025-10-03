import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import "./ak-notification-badge.js";
import type { NotificationBadgeProps } from "./ak-notification-badge.types.js";
import type { NotificationBadge } from "./ak-notification-badge.component.js";

const meta: Meta<NotificationBadgeProps> = {
    title: "Components/Notification Badge",
    component: "ak-notification-badge",
    tags: ["autodocs"],
    argTypes: {
        count: {
            control: { type: "number", min: 0, max: 999 },
            description: "Number of notifications to display",
        },
        variant: {
            control: { type: "select" },
            options: ["read", "unread", "attention"],
            description: "Visual variant affecting color scheme",
        },
        theme: {
            control: { type: "radio" },
            options: ["light", "dark"],
            description: "Theme variant for different backgrounds",
        },
        expanded: {
            control: { type: "boolean" },
            description: "Visual state indicating associated content is expanded",
        },
        notifier: {
            control: false,
            description: "Function to generate aria-label from count",
        },
    },
    args: {
        count: 0,
    },
};

export default meta;
type Story = StoryObj<NotificationBadgeProps>;

const Template: Story = {
    render: ({ variant, expanded, count, icon }) =>
        html`<ak-notification-badge
            count=${count}
            variant=${ifDefined(variant)}
            ?expanded=${!!expanded}
            >${icon ?? nothing}</ak-notification-badge
        >`,
};

export const Defaults: Story = {
    ...Template,
    args: {
        count: 5,
    },
};

export const NoCount: Story = {
    ...Template,
    args: {
        count: 0,
    },
    parameters: {
        docs: {
            description: {
                story: "When count is 0, only the icon is displayed without a number.",
            },
        },
    },
};

export const SingleNotification: Story = {
    ...Template,
    args: {
        count: 1,
    },
    parameters: {
        docs: {
            description: {
                story: 'Aria-label announces "One unread notification" for singular case.',
            },
        },
    },
};

export const HighCount: Story = {
    ...Template,
    args: {
        count: 127,
    },
    parameters: {
        docs: {
            description: {
                story: "Badge handles large numbers without layout issues.",
            },
        },
    },
};

export const VariantRead: Story = {
    ...Template,
    args: {
        count: 0,
        variant: "read",
    },
    parameters: {
        docs: {
            description: {
                story: "Read variant with transparent background for already-viewed notifications.",
            },
        },
    },
};

export const VariantUnread: Story = {
    ...Template,
    args: {
        count: 3,
        variant: "unread",
    },
    parameters: {
        docs: {
            description: {
                story: "Unread variant with blue background and white text.",
            },
        },
    },
};

export const VariantAttention: Story = {
    ...Template,
    args: {
        count: 2,
        variant: "attention",
    },
    parameters: {
        docs: {
            description: {
                story: "Attention variant with red background for urgent notifications.",
            },
        },
    },
};

export const Expanded: Story = {
    ...Template,
    args: {
        count: 5,
        variant: "unread",
        expanded: true,
    },
    parameters: {
        docs: {
            description: {
                story: "Expanded state shows darker background, indicating associated panel is open.",
            },
        },
    },
};

export const CustomIcon: Story = {
    render: (args) => html`
        <ak-notification-badge count=${args.count} variant=${args.variant}>
            <ak-icon icon="envelope"></ak-icon>
        </ak-notification-badge>
    `,
    args: {
        count: 12,
        variant: "attention",
    },
    parameters: {
        docs: {
            description: {
                story: "Default icon can be replaced by slotting in a different icon.",
            },
        },
    },
};

export const InteractiveExample: Story = {
    render: () => {
        let count = 5;
        let expanded = false;

        const handleClick = (e: Event) => {
            const badge = e.target as NotificationBadge;
            expanded = !expanded;
            badge.toggleAttribute("expanded", expanded);

            // Simulate marking notifications as read
            if (expanded && count > 0) {
                const interval = setInterval(() => {
                    count--;
                    badge.count = count;
                    if (count === 0) {
                        clearInterval(interval);
                        badge.setAttribute("variant", "read");
                    }
                }, 500);
            }
        };

        return html`
            <div>
                <p>Click the badge to expand and mark notifications as read:</p>
                <ak-notification-badge
                    count=${count}
                    variant="unread"
                    @click=${handleClick}
                ></ak-notification-badge>
            </div>
        `;
    },
    parameters: {
        docs: {
            description: {
                story: "Interactive example showing click handling, expanded state, and count updates. Parent component manages state via event listeners.",
            },
        },
    },
};

export const CustomNotifier: Story = {
    render: (args) => {
        const customNotifier = (count: number) => {
            if (count === 0) return "Inbox zero!";
            if (count === 1) return "You have 1 new message";
            return `You have ${count} new messages`;
        };

        return html`
            <ak-notification-badge
                count=${args.count}
                variant=${args.variant}
                .notifier=${customNotifier}
            ></ak-notification-badge>
        `;
    },
    args: {
        count: 7,
        variant: "unread",
    },
    parameters: {
        docs: {
            description: {
                story: "Custom notifier function to generate different aria-label messages.",
            },
        },
    },
};

export const VariantComparison: Story = {
    render: () => html`
        <div style="display: flex; gap: 2rem; align-items: center;">
            <div style="text-align: center;">
                <ak-notification-badge count="0" variant="read"></ak-notification-badge>
                <p style="margin-top: 0.5rem; font-size: 0.875rem;">Read (0)</p>
            </div>
            <div style="text-align: center;">
                <ak-notification-badge count="3" variant="read"></ak-notification-badge>
                <p style="margin-top: 0.5rem; font-size: 0.875rem;">Read (3)</p>
            </div>
            <div style="text-align: center;">
                <ak-notification-badge count="5" variant="unread"></ak-notification-badge>
                <p style="margin-top: 0.5rem; font-size: 0.875rem;">Unread</p>
            </div>
            <div style="text-align: center;">
                <ak-notification-badge count="2" variant="attention"></ak-notification-badge>
                <p style="margin-top: 0.5rem; font-size: 0.875rem;">Attention</p>
            </div>
        </div>
    `,
    parameters: {
        docs: {
            description: {
                story: "Side-by-side comparison of all variant states.",
            },
        },
    },
};

// eslint-disable-next-line no-console
const clickmsg = (message: string) => () => console.log(message);

export const KeyboardNavigation: Story = {
    render: () => html`
        <div>
            <p>Tab to focus, press Enter or Space to activate:</p>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <ak-notification-badge
                    count="3"
                    variant="unread"
                    @click=${clickmsg("Badge 1 clicked")}
                ></ak-notification-badge>
                <ak-notification-badge
                    count="7"
                    variant="attention"
                    @click=${clickmsg("Badge 2 clicked")}
                ></ak-notification-badge>
                <ak-notification-badge
                    count="0"
                    variant="read"
                    @click=${clickmsg("Badge 3 clicked")}
                ></ak-notification-badge>
            </div>
            <p style="margin-top: 1rem; font-size: 0.875rem; color: #6a6e73;">
                Check console for click events
            </p>
        </div>
    `,
    parameters: {
        docs: {
            description: {
                story: "Demonstrates keyboard accessibility with Enter and Space key support.",
            },
        },
    },
};

export const NegativeCountHandling: Story = {
    render: () => {
        setTimeout(() => {
            const badge = document.querySelector("#negative-test") as NotificationBadge;
            if (badge) {
                // eslint-disable-next-line no-console
                console.log("Setting count to -5");
                badge.count = -5;
                setTimeout(() => {
                    // eslint-disable-next-line no-console
                    console.log("Actual count after update:", badge.count);
                }, 100);
            }
        }, 100);

        return html`
            <div>
                <p>Negative counts are automatically clamped to 0 (check console):</p>
                <ak-notification-badge
                    id="negative-test"
                    count="10"
                    variant="unread"
                ></ak-notification-badge>
            </div>
        `;
    },
    parameters: {
        docs: {
            description: {
                story: "Component guards against negative count values by clamping to 0.",
            },
        },
    },
};
