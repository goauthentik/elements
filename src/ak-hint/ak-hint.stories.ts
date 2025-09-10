import type { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";

import "./ak-hint.js";
import { Hint, akHint } from "./ak-hint.js";

const meta: Meta<Hint> = {
    title: "Elements/Hint",
    component: "ak-hint",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
The \`ak-hint\` component provides a container for displaying informative content with optional title
and footer sections. It's designed to call attention to important information
or optional features.
        `,
            },
        },
    },
};

export default meta;
type Story = StoryObj<Hint>;

export const Basic: Story = {
    parameters: {
        docs: {
            description: {
                story: "A simple hint with just body content.",
            },
        },
    },
    render: () => html`
        <ak-hint>
            <p>
                This is a basic hint with some helpful information for the user. Like "Never run
                with scissors."
            </p>
        </ak-hint>
    `,
};

export const WithTitle: Story = {
    parameters: {
        docs: {
            description: {
                story: "Hint with a title to provide context for the information.",
            },
        },
    },
    render: () => html`
        <ak-hint>
            <h3 slot="title">Pro Tip</h3>
            <p>Wait, we have keyboard shortcuts? I wish.</p>
        </ak-hint>
    `,
};

export const WithFooter: Story = {
    parameters: {
        docs: {
            description: {
                story: "Hint with footer content for additional resources or actions.",
            },
        },
    },
    render: () => html`
        <ak-hint>
            <p>Feature flags are a way of shipping incomplete code. Change my mind.</p>
            <div slot="footer">
                <a href="#" style="color: #0066cc;">Learn more about feature flags →</a>
            </div>
        </ak-hint>
    `,
};

export const Complete: Story = {
    parameters: {
        docs: {
            description: {
                story: "Complete hint with title, body content, and footer.",
            },
        },
    },
    render: () => html`
        <ak-hint>
            <h3 slot="title">Getting Started</h3>
            <p>Welcome to authentik! Here are some quick tips to help you get up and running:</p>
            <ul>
                <li>Add a few Applications</li>
                <li>Add a few Policies</li>
                <li>Check out the documentation</li>
            </ul>
            <div slot="footer">
                Need help? <a href="#" style="color: #0066cc;">View our tutorials</a>
            </div>
        </ak-hint>
    `,
};

export const MultipleHints: Story = {
    parameters: {
        docs: {
            description: {
                story: "Multiple hints showing different use cases and content types.",
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <ak-hint>
                <h4 slot="title">💡 Quick Tip</h4>
                <p>Don't drop a book on your foot.</p>
            </ak-hint>

            <ak-hint>
                <h4 slot="title">🔒 Security Notice</h4>
                <p>You've got your TOTP set up, right?</p>
                <div slot="footer">
                    <strong>Action:</strong> <a href="#" style="color: #0066cc;">Enable 2FA now</a>
                </div>
            </ak-hint>

            <ak-hint>
                <h4 slot="title">📊 Performance Insight</h4>
                <p>
                    Your response time is 23% better this week! You've been allocated one (1)
                    additional ration of Slurm!
                </p>
                <div slot="footer">
                    <a href="#" style="color: #0066cc;">View detailed analytics</a>
                </div>
            </ak-hint>
        </div>
    `,
};

export const UsingBuilderFunction: Story = {
    parameters: {
        docs: {
            description: {
                story: "Creating hints programmatically using the akHint helper function.",
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
                <h4>Simple content with builder:</h4>
                ${akHint({ body: "This hint was created with the akHint() helper function." })}
            </div>

            <div>
                <h4>With title and footer:</h4>
                ${akHint({
                    body: html`<p>
                        This demonstrates the full capabilities of the builder function.
                    </p>`,
                    title: "Builder Function Demo",
                    footer: html`<em>Created programmatically</em>`,
                })}
            </div>
        </div>
    `,
};

// Enhanced CustomStyling story (replace existing)
export const CustomStyling: Story = {
    parameters: {
        docs: {
            description: {
                story: "Customizing hint appearance using both CSS custom properties and CSS parts.",
            },
        },
    },
    render: () => html`
        <style>
            /* Using CSS Custom Properties */
            .custom-hint {
                --pf-v5-c-hint--BackgroundColor: #f0f9ff;
                --pf-v5-c-hint--BorderColor: #0284c7;
                --pf-v5-c-hint--Color: #0c4a6e;
                --pf-v5-c-hint--PaddingTop: 2rem;
                --pf-v5-c-hint--PaddingBottom: 2rem;
            }

            /* Using CSS Parts for fine-grained control */
            .parts-styled::part(hint) {
                border-radius: 12px;
                border-style: dashed;
                position: relative;
                overflow: hidden;
            }

            .parts-styled::part(hint)::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #3b82f6, #06b6d4);
            }

            .parts-styled::part(title) {
                color: #1e40af;
                font-weight: bold;
            }

            .parts-styled::part(body) {
                font-style: italic;
            }
        </style>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
                <h4>CSS Custom Properties Styling</h4>
                <ak-hint class="custom-hint">
                    <h4 slot="title">Custom Blue Theme</h4>
                    <p>Hint using just the CSS custom properties.</p>
                </ak-hint>
            </div>

            <div>
                <h4>CSS Parts Styling</h4>
                <ak-hint class="parts-styled">
                    <h4 slot="title">Advanced Styling</h4>
                    <p>
                        Hint using CSS parts for fine-grained control with gradient border, rounded
                        corners, and individual part styling.
                    </p>
                    <div slot="footer">Using CSS parts allows for precise control.</div>
                </ak-hint>
            </div>
        </div>
    `,
};

// New dedicated story for CSS Parts
export const CSSPartsShowcase: Story = {
    parameters: {
        docs: {
            description: {
                story: "Demonstrating advanced styling capabilities using CSS parts for precise design control.",
            },
        },
    },
    render: () => html`
        <style>
            /* Card-like styling with shadow */
            .card-hint::part(hint) {
                border-radius: 8px;
                box-shadow:
                    0 4px 6px -1px rgba(0, 0, 0, 0.1),
                    0 2px 4px -1px rgba(0, 0, 0, 0.06);
                border: none;
                background: white;
                overflow: hidden;
            }

            .card-hint::part(title) {
                background: #f8fafc;
                margin: -1.5rem -1.5rem 1rem -1.5rem;
                padding: 1rem 1.5rem;
                border-bottom: 1px solid #e2e8f0;
                font-size: 1.1rem;
                color: #1e293b;
            }

            /* Notification-style with left border accent */
            .notification-hint::part(hint) {
                border-left: 4px solid #10b981;
                border-radius: 0 6px 6px 0;
                background: #f0fdf4;
                border-color: #bbf7d0;
            }

            .notification-hint::part(title) {
                color: #065f46;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .notification-hint::part(title)::before {
                content: "✅";
                font-size: 1.2em;
            }

            .notification-hint::part(body) {
                color: #047857;
            }

            /* Callout-style with decorative elements */
            .callout-hint::part(hint) {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 12px;
                color: white;
                position: relative;
            }

            .callout-hint::part(hint)::after {
                content: "💡";
                position: absolute;
                top: 1rem;
                right: 1rem;
                font-size: 2rem;
                opacity: 0.3;
            }

            .callout-hint::part(title) {
                color: #fef3c7;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }

            .callout-hint::part(footer) {
                opacity: 0.9;
                font-size: 0.9em;
            }

            /* Modern glass morphism effect */
            .glass-hint {
                background: linear-gradient(
                    135deg,
                    rgba(255, 255, 255, 0.1),
                    rgba(255, 255, 255, 0)
                );
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.18);
            }

            .glass-hint::part(hint) {
                background: rgba(255, 255, 255, 0.25);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.18);
                border-radius: 16px;
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            }

            .glass-hint::part(title) {
                color: #1e293b;
                font-weight: 600;
            }
        </style>

        <div
            style="display: flex; flex-direction: column; gap: 2rem; background: linear-gradient(135deg, #74b9ff, #0984e3); padding: 2rem; border-radius: 8px;"
        >
            <div>
                <h4 style="color: white; margin-top: 0;">Card-Style Hint</h4>
                <ak-hint class="card-hint">
                    <div slot="title">Card-Style Design</div>
                    <p>Basic card design in a hint with a separate and distinct "header" style.</p>
                    <div slot="footer">Perfect for structured information</div>
                </ak-hint>
            </div>

            <div>
                <h4 style="color: white;">Notification-Style Hint</h4>
                <ak-hint class="notification-hint">
                    <div slot="title">Success Notification</div>
                    <p>
                        CSS Parts can add <code>::before</code> and <code>::after</code>, which
                        increases our decorative options.
                    </p>
                </ak-hint>
            </div>

            <div>
                <h4 style="color: white;">Gradient Callout</h4>
                <ak-hint class="callout-hint">
                    <div slot="title">Pro Tip</div>
                    <p>Using CSS parts allows us to apply gradients to the component.</p>
                    <div slot="footer">Get creative with your designs!</div>
                </ak-hint>
            </div>

            <div>
                <h4 style="color: white;">Glass Morphism Effect</h4>
                <ak-hint class="glass-hint">
                    <div slot="title">Modern Glass Effect</div>
                    <p>CSS parts allow us to try a little glassmorphism, as a treat.</p>
                </ak-hint>
            </div>
        </div>
    `,
};

// Additional story showing practical theming patterns
export const ThemeVariants: Story = {
    parameters: {
        docs: {
            description: {
                story: "Practical theme variants using CSS parts that could be part of a design system.",
            },
        },
    },
    render: () => html`
        <style>
            /* Success theme */
            .hint-success::part(hint) {
                background: #f0fdf4;
                border-color: #22c55e;
                border-left: 4px solid #22c55e;
                border-radius: 0 6px 6px 0;
            }

            .hint-success::part(title) {
                color: #15803d;
            }

            .hint-success::part(body) {
                color: #166534;
            }

            /* Warning theme */
            .hint-warning::part(hint) {
                background: #fefce8;
                border-color: #eab308;
                border-left: 4px solid #eab308;
                border-radius: 0 6px 6px 0;
            }

            .hint-warning::part(title) {
                color: #a16207;
            }

            .hint-warning::part(body) {
                color: #854d0e;
            }

            /* Info theme */
            .hint-info::part(hint) {
                background: #f0f9ff;
                border-color: #3b82f6;
                border-left: 4px solid #3b82f6;
                border-radius: 0 6px 6px 0;
            }

            .hint-info::part(title) {
                color: #1d4ed8;
            }

            .hint-info::part(body) {
                color: #1e40af;
            }

            /* Danger theme */
            .hint-danger::part(hint) {
                background: #fef2f2;
                border-color: #ef4444;
                border-left: 4px solid #ef4444;
                border-radius: 0 6px 6px 0;
            }

            .hint-danger::part(title) {
                color: #dc2626;
            }

            .hint-danger::part(body) {
                color: #b91c1c;
            }
        </style>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <ak-hint class="hint-success">
                <div slot="title">✅ Success</div>
                <p>I am fully operational!</p>
                <div slot="footer">Everything is going according to plan.</div>
            </ak-hint>

            <ak-hint class="hint-warning">
                <div slot="title">⚠️ Warning</div>
                <p>I'm sorry, Dave</p>
                <div slot="footer">I'm afraid I can't do that.</div>
            </ak-hint>

            <ak-hint class="hint-info">
                <div slot="title">ℹ️ Information</div>
                <p>Here's some helpful information about this feature.</p>
                <div slot="footer">Knowing more won't save you...</div>
            </ak-hint>

            <ak-hint class="hint-danger">
                <div slot="title">🚨 Important</div>
                <p>This action cannot be undone. Please be careful.</p>
                <div slot="footer">
                    <b>Sutureself Home Surgery</b> is not responsible for misuse.
                </div>
            </ak-hint>
        </div>
    `,
};

export const AccessibilityExample: Story = {
    parameters: {
        docs: {
            description: {
                story: "Demonstrating accessibility best practices with hints.",
            },
        },
    },
    render: () => html`
        <ak-hint>
            <h3 slot="title" id="accessibility-tip">Accessibility Tip</h3>
            <div role="region" aria-labelledby="accessibility-tip">
                <p>
                    When creating forms, always associate labels with their corresponding input
                    fields using the <code>for</code> attribute or by nesting the input inside the
                    label.
                </p>
                <p>
                    This helps screen readers understand the relationship between labels and inputs.
                </p>
            </div>
            <div slot="footer">
                <a href="#" style="color: #0066cc;">Learn more about web accessibility</a>
            </div>
        </ak-hint>
    `,
};
