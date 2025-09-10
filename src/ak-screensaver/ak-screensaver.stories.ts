import "./ak-screensaver.js";

import { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";

type StoryProps = {
    speed: number;
    paused: boolean;
    forceReducedMotion: boolean;
    reducedMotionInterval: number;
};

const metadata: Meta<Partial<StoryProps>> = {
    title: "Elements/Screensaver",
    component: "ak-screensaver",
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
The \`ak-screensaver\` component creates a screensaver-like bouncing animation that can be
used for privacy screens or decorative purposes. It accepts any content via its default
slot and animates it within its container.
        `,
            },
        },
    },
    argTypes: {
        speed: {
            control: { type: "range", min: 0.1, max: 5.0, step: 0.1 },
            description: "Animation speed multiplier for continuous motion",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "1.0" },
            },
        },
        paused: {
            control: "boolean",
            description: "Whether the animation is paused",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        forceReducedMotion: {
            control: "boolean",
            description: "Forces reduced motion mode regardless of user preference",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        reducedMotionInterval: {
            control: { type: "range", min: 1, max: 120, step: 1 },
            description: "Interval in seconds between position changes in reduced motion mode",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "60" },
            },
        },
    },
    decorators: [
        (story) => html`
            <div
                style="position: relative; height: 400px; width: 100%; border: 2px dashed #ccc; overflow: hidden;"
            >
                ${story()}
            </div>
        `,
    ],
};

export default metadata;

type Story = StoryObj<StoryProps>;

// Basic screensaver with text content
export const Basic: Story = {
    args: {
        speed: 1.0,
        paused: false,
        forceReducedMotion: false,
        reducedMotionInterval: 60,
    },
    render: (args: StoryProps) => html`
        <ak-screensaver
            speed=${args.speed}
            ?paused=${args.paused}
            ?force-reduced-motion=${args.forceReducedMotion}
            reduced-motion-interval=${args.reducedMotionInterval}
        >
            <img class="icon" src="/icon_left_brand.svg" alt="Logo" style="height: 48px;" />
        </ak-screensaver>
    `,
};

// Screensaver with SVG content
export const WithSVG: Story = {
    args: {
        speed: 1.5,
        paused: false,
        forceReducedMotion: false,
        reducedMotionInterval: 60,
    },
    render: (args: StoryProps) => html`
        <ak-screensaver
            speed=${args.speed}
            ?paused=${args.paused}
            ?force-reduced-motion=${args.forceReducedMotion}
            reduced-motion-interval=${args.reducedMotionInterval}
        >
            <svg width="120" height="60" viewBox="0 0 120 60">
                <rect width="120" height="60" fill="#06c" rx="8" />
                <text
                    x="60"
                    y="35"
                    text-anchor="middle"
                    fill="white"
                    font-family="Arial"
                    font-size="14"
                >
                    SVG Logo
                </text>
            </svg>
        </ak-screensaver>
    `,
};

// Screensaver with image content
export const WithImage: Story = {
    args: {
        speed: 0.8,
        paused: false,
        forceReducedMotion: false,
        reducedMotionInterval: 60,
    },
    render: (args: StoryProps) => html`
        <ak-screensaver
            speed=${args.speed}
            ?paused=${args.paused}
            ?force-reduced-motion=${args.forceReducedMotion}
            reduced-motion-interval=${args.reducedMotionInterval}
        >
            <div
                style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem 1rem; background: rgba(255,255,255,0.1); border-radius: 8px;"
            >
                <div
                    style="width: 40px; height: 40px; background: #ff6b6b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;"
                >
                    IMG
                </div>
                <span>Company Brand</span>
            </div>
        </ak-screensaver>
    `,
};

// Paused state demonstration
export const Paused: Story = {
    args: {
        speed: 1.0,
        paused: true,
        forceReducedMotion: false,
        reducedMotionInterval: 60,
    },
    parameters: {
        docs: {
            description: {
                story: "Screensaver in paused state - content remains stationary.",
            },
        },
    },
    render: (args: StoryProps) => html`
        <ak-screensaver
            speed=${args.speed}
            ?paused=${args.paused}
            ?force-reduced-motion=${args.forceReducedMotion}
            reduced-motion-interval=${args.reducedMotionInterval}
        >
            <div
                style="text-align: center; padding: 1rem; border: 2px solid currentColor; border-radius: 8px;"
            >
                <h2 style="margin: 0; color: #ffd700;">⏸️ PAUSED</h2>
                <p style="margin: 0.5rem 0 0; opacity: 0.8;">Animation is stopped</p>
            </div>
        </ak-screensaver>
    `,
};

// Reduced motion mode
export const ReducedMotion: Story = {
    args: {
        speed: 1.0,
        paused: false,
        forceReducedMotion: true,
        reducedMotionInterval: 3,
    },
    parameters: {
        docs: {
            description: {
                story: "Demonstrates reduced motion mode with faster interval for visibility. Content teleports to random positions instead of smooth bouncing.",
            },
        },
    },
    render: (args: StoryProps) => html`
        <ak-screensaver
            speed=${args.speed}
            ?paused=${args.paused}
            ?force-reduced-motion=${args.forceReducedMotion}
            reduced-motion-interval=${args.reducedMotionInterval}
        >
            <div
                style="background: rgba(0,255,0,0.2); padding: 1rem; border-radius: 8px; text-align: center;"
            >
                <h3 style="margin: 0; color: #00ff00;">♿ Reduced Motion</h3>
                <p style="margin: 0.5rem 0 0; font-size: 0.9rem;">
                    Teleports every ${args.reducedMotionInterval} seconds
                </p>
            </div>
        </ak-screensaver>
    `,
};

// Speed variations
export const SpeedVariations: Story = {
    parameters: {
        docs: {
            description: {
                story: "Different animation speeds from very slow to very fast.",
            },
        },
    },
    render: () => html`
        <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; height: 600px;"
        >
            <div style="position: relative; border: 1px solid #ccc; overflow: hidden;">
                <div
                    style="position: absolute; top: 8px; left: 8px; z-index: 1001; background: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 4px; font-size: 12px;"
                >
                    Speed: 0.2
                </div>
                <ak-screensaver speed="0.2">
                    <div
                        style="padding: 0.5rem; background: rgba(255,100,100,0.8); border-radius: 4px;"
                    >
                        🐌 Slow
                    </div>
                </ak-screensaver>
            </div>

            <div style="position: relative; border: 1px solid #ccc; overflow: hidden;">
                <div
                    style="position: absolute; top: 8px; left: 8px; z-index: 1001; background: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 4px; font-size: 12px;"
                >
                    Speed: 1.0
                </div>
                <ak-screensaver speed="1.0">
                    <div
                        style="padding: 0.5rem; background: rgba(100,255,100,0.8); border-radius: 4px;"
                    >
                        🚶 Normal
                    </div>
                </ak-screensaver>
            </div>

            <div style="position: relative; border: 1px solid #ccc; overflow: hidden;">
                <div
                    style="position: absolute; top: 8px; left: 8px; z-index: 1001; background: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 4px; font-size: 12px;"
                >
                    Speed: 3.0
                </div>
                <ak-screensaver speed="3.0">
                    <div
                        style="padding: 0.5rem; background: rgba(100,100,255,0.8); border-radius: 4px;"
                    >
                        🏃 Fast
                    </div>
                </ak-screensaver>
            </div>
        </div>
    `,
};

// Custom styling with CSS properties
export const CustomStyling: Story = {
    parameters: {
        docs: {
            description: {
                story: "Demonstrates customization using CSS custom properties.",
            },
        },
    },
    render: () => html`
        <style>
            .purple-screensaver {
                --pf-v5-c-screensaver--Background: linear-gradient(
                    135deg,
                    #667eea 0%,
                    #764ba2 100%
                );
                --pf-v5-c-screensaver--Height: 5rem;
                --pf-v5-c-screensaver--Color: #ffffff;
                --pf-v5-c-screensaver--Transition: 2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .orange-screensaver {
                --pf-v5-c-screensaver--Background: radial-gradient(
                    circle,
                    #ff7e5f 0%,
                    #feb47b 100%
                );
                --pf-v5-c-screensaver--Height: 3rem;
                --pf-v5-c-screensaver--Color: #8b4513;
            }

            .minimal-screensaver {
                --pf-v5-c-screensaver--Background: rgba(240, 240, 240, 0.95);
                --pf-v5-c-screensaver--Height: 2.5rem;
                --pf-v5-c-screensaver--Color: #333;
            }
        </style>

        <div style="display: flex; flex-direction: column; gap: 1rem; height: 800px;">
            <div
                style="position: relative; height: 200px; border: 1px solid #ccc; overflow: hidden;"
            >
                <div
                    style="position: absolute; top: 8px; left: 8px; z-index: 1001; background: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 4px; font-size: 12px;"
                >
                    Purple Gradient
                </div>
                <ak-screensaver class="purple-screensaver" speed="1.2">
                    <div
                        style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.2rem; font-weight: bold;"
                    >
                        ✨ Purple Theme ✨
                    </div>
                </ak-screensaver>
            </div>

            <div
                style="position: relative; height: 200px; border: 1px solid #ccc; overflow: hidden;"
            >
                <div
                    style="position: absolute; top: 8px; left: 8px; z-index: 1001; background: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 4px; font-size: 12px;"
                >
                    Orange Radial
                </div>
                <ak-screensaver
                    class="orange-screensaver"
                    speed="0.8"
                    force-reduced-motion
                    reduced-motion-interval="4"
                >
                    <div
                        style="display: flex; align-items: center; gap: 0.5rem; font-weight: bold;"
                    >
                        🔥 Orange Vibes 🔥
                    </div>
                </ak-screensaver>
            </div>

            <div
                style="position: relative; height: 200px; border: 1px solid #ccc; overflow: hidden;"
            >
                <div
                    style="position: absolute; top: 8px; left: 8px; z-index: 1001; background: rgba(0,0,0,0.1); padding: 4px 8px; border-radius: 4px; font-size: 12px;"
                >
                    Minimal Light
                </div>
                <ak-screensaver class="minimal-screensaver" speed="1.5">
                    <div style="font-family: monospace; font-size: 0.9rem;">→ minimal design →</div>
                </ak-screensaver>
            </div>
        </div>
    `,
};

// Complex content demonstration
export const ComplexContent: Story = {
    args: {
        speed: 1.0,
        paused: false,
        forceReducedMotion: false,
        reducedMotionInterval: 60,
    },
    parameters: {
        docs: {
            description: {
                story: "Screensaver with complex HTML content including multiple elements and styling.",
            },
        },
    },
    render: (args: StoryProps) => html`
        <ak-screensaver
            speed=${args.speed}
            ?paused=${args.paused}
            ?force-reduced-motion=${args.forceReducedMotion}
            reduced-motion-interval=${args.reducedMotionInterval}
        >
            <div
                style="
                background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2));
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 12px;
                padding: 1rem 1.5rem;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                backdrop-filter: blur(10px);
                text-align: center;
                min-width: 200px;
            "
            >
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎉</div>
                <h3 style="margin: 0; font-size: 1.2rem; font-weight: bold;">Complex Card</h3>
                <p style="margin: 0.5rem 0 0; font-size: 0.9rem; opacity: 0.8;">
                    Rich HTML content with multiple elements and advanced styling
                </p>
                <div
                    style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 0.5rem;"
                >
                    <span
                        style="padding: 0.2rem 0.5rem; background: rgba(0,255,0,0.3); border-radius: 12px; font-size: 0.8rem;"
                        >HTML</span
                    >
                    <span
                        style="padding: 0.2rem 0.5rem; background: rgba(255,0,255,0.3); border-radius: 12px; font-size: 0.8rem;"
                        >CSS</span
                    >
                </div>
            </div>
        </ak-screensaver>
    `,
};
