import { mediaQuery } from "./mediaquery-observer.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators/custom-element.js";

@customElement("media-query-test")
export class MediaQueryTest extends LitElement {
    public static override readonly styles = css`
        :host {
            display: block;
            padding: 2rem;
            font-family: system-ui, sans-serif;
        }

        .status {
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 2px solid;
            transition: all 0.3s ease;
            background-color: mediumspringgreen;
            border-color: darkgreen;
        }

        .status.narrow {
            background-color: darkmagenta;
            border-color: antiquewhite;
        }

        .desc {
            color: black;
        }

        .narrow .desc {
            color: lemonchiffon;
        }
    `;

    @mediaQuery("(min-width: 768px)")
    protected isWideScreen = false;

    public override render() {
        return html`
            <div style="max-width: 50rem; margin: 0 auto">
                <div class="status ${this.isWideScreen ? "wide" : "narrow"}">
                    <h2
                        class="desc"
                        style="font-size: 1.4rem; font-weight: bold; margin: 0 0 0.5rem 0;"
                    >
                        ${this.isWideScreen ? "💻 Wide Screen" : "📱 Narrow Screen"}
                    </h2>
                    <p class="desc">
                        ${this.isWideScreen
                            ? "Your viewport is at least 768px wide"
                            : "Your viewport is less than 768px wide"}
                    </p>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "media-query-test": MediaQueryTest;
    }
}

const meta = {
    title: "Utilities/Media Query Observer",
    component: "media-query-test",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `
A decorator-based media query observer for Lit components. This allows components to reactively respond to media query changes without manually managing MediaQueryList listeners.

## Features

- **Automatic lifecycle management**: Watchers are automatically added when components connect and removed when they disconnect
- **Shared monitoring**: Multiple components can observe the same media query without creating duplicate listeners
- **Reactive updates**: Changes trigger Lit's reactive update cycle automatically

## Usage

\`\`\`typescript
import { mediaQueryObserver } from "./mediaquery-observer";

class MyComponent extends LitElement {
    @mediaQueryObserver("(prefers-reduced-motion: reduce)")
    prefersReducedMotion = false;

    render() {
        return html\`
            <div>Animations: \${this.prefersReducedMotion ? 'off' : 'on'}</div>
        \`;
    }
}
\`\`\`

## Testing

Resize your browser window to see the component react to viewport width changes. The test component uses a breakpoint at 768px.
`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * The basic media query observer demonstration. Resize your browser window to see
 * the component react to the (min-width: 768px) media query.
 *
 * The component will show a green background when the viewport is at least 768px wide,
 * and an orange background when it's narrower.
 */
export const Default: Story = {
    render: () => html`<media-query-test></media-query-test>`,
};

/**
 * Multiple instances of the component will all respond to the same media query
 * without creating duplicate listeners. This demonstrates the efficiency of the
 * shared monitoring system.
 */
export const MultipleInstances: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem;">
            <media-query-test></media-query-test>
            <media-query-test></media-query-test>
            <media-query-test></media-query-test>
        </div>
    `,
    parameters: {
        docs: {
            description: {
                story: "Multiple components observing the same media query share a single MediaQueryList listener for efficiency.",
            },
        },
    },
};

/**
 * This story shows the component in an iframe that can be resized to specific
 * viewport widths to test the breakpoint behavior more precisely.
 */
export const ResponsivePreview: Story = {
    render: () => html`<media-query-test></media-query-test>`,
    parameters: {
        viewport: {
            defaultViewport: "mobile1",
        },
        docs: {
            description: {
                story: "Use Storybook's viewport toolbar to test different screen sizes. Try switching between mobile, tablet, and desktop viewports.",
            },
        },
    },
};
