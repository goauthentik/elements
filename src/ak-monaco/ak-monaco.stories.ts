import "./ak-monaco.js";

import { akMonaco, Monaco } from "./ak-monaco.js";

import type { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

const metadata: Meta<Monaco> = {
    title: "Application / Monaco Editor",
    component: "ak-monaco",
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: `
todo
                `,
            },
        },
    },
    argTypes: {
        value: {
            control: "text",
            description: "The content of the editor",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: '""' },
            },
        },
        language: {
            control: { type: "select" },
            options: ["javascript", "typescript", "json", "css", "html", "python", "java", "csharp", "go"],
            description: "The language mode for syntax highlighting",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: '"javascript"' },
            },
        },
        readOnly: {
            control: "boolean",
            description: "Whether the editor is read-only",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        theme: {
            control: { type: "select" },
            options: ["vs", "vs-dark", "hc-black"],
            description: "The theme for the editor",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: '"vs-dark"' },
            },
        },
    },
};

export default metadata;

type Story = StoryObj<Monaco>;

const sampleJavaScript = `console.log("Hello, World!");`;

const sampleTypeScript = `const message: string = "Hello TypeScript!";`;

const sampleJSON = `{ "name": "example", "version": "1.0.0" }`;

const sampleCSS = `.container { display: flex; color: #333; }`;

const sampleHTML = `<div class="example">Hello HTML!</div>`;

export const Default: Story = {
    args: {
        value: sampleJavaScript,
        language: "javascript",
        theme: "vs-dark",
        readOnly: false,
    },
    render: (args) => html`
        <div style="width: 600px; height: 400px;">
            <ak-monaco
                value=${ifDefined(args.value)}
                language=${ifDefined(args.language)}
                ?read-only=${args.readOnly}
                theme=${ifDefined(args.theme)}
            ></ak-monaco>
        </div>
    `,
};

export const TypeScript: Story = {
    args: {
        value: sampleTypeScript,
        language: "typescript",
        theme: "vs-dark",
    },
    render: (args) => html`
        <div style="width: 700px; height: 450px;">
            <ak-monaco
                value=${ifDefined(args.value)}
                language=${ifDefined(args.language)}
                theme=${ifDefined(args.theme)}
            ></ak-monaco>
        </div>
    `,
};

export const JSONEditor: Story = {
    args: {
        value: sampleJSON,
        language: "json",
        theme: "vs",
    },
    render: (args) => html`
        <div style="width: 500px; height: 350px;">
            <ak-monaco
                value=${ifDefined(args.value)}
                language=${ifDefined(args.language)}
                theme=${ifDefined(args.theme)}
            ></ak-monaco>
        </div>
    `,
};

export const CSSEditor: Story = {
    args: {
        value: sampleCSS,
        language: "css",
        theme: "vs-dark",
    },
    render: (args) => html`
        <div style="width: 600px; height: 400px;">
            <ak-monaco
                value=${ifDefined(args.value)}
                language=${ifDefined(args.language)}
                theme=${ifDefined(args.theme)}
            ></ak-monaco>
        </div>
    `,
};

export const HTMLEditor: Story = {
    args: {
        value: sampleHTML,
        language: "html",
        theme: "vs",
    },
    render: (args) => html`
        <div style="width: 700px; height: 500px;">
            <ak-monaco
                value=${ifDefined(args.value)}
                language=${ifDefined(args.language)}
                theme=${ifDefined(args.theme)}
            ></ak-monaco>
        </div>
    `,
};

export const ReadOnlyMode: Story = {
    args: {
        value: sampleJavaScript,
        language: "javascript",
        theme: "vs-dark",
        readOnly: true,
    },
    render: (args) => html`
        <div style="width: 600px; height: 350px;">
            <h4 style="margin: 0 0 10px 0; color: #666;">Read-only Editor</h4>
            <ak-monaco
                value=${ifDefined(args.value)}
                language=${ifDefined(args.language)}
                ?read-only=${args.readOnly}
                theme=${ifDefined(args.theme)}
            ></ak-monaco>
        </div>
    `,
};

export const LightTheme: Story = {
    args: {
        value: sampleTypeScript,
        language: "typescript",
        theme: "vs",
    },
    render: (args) => html`
        <div style="width: 650px; height: 400px; background: #f8f8f8; padding: 20px; border-radius: 8px;">
            <h4 style="margin: 0 0 15px 0; color: #333;">Light Theme Editor</h4>
            <ak-monaco
                value=${ifDefined(args.value)}
                language=${ifDefined(args.language)}
                theme=${ifDefined(args.theme)}
            ></ak-monaco>
        </div>
    `,
};

export const HighContrastTheme: Story = {
    args: {
        value: sampleCSS,
        language: "css",
        theme: "hc-black",
    },
    render: (args) => html`
        <div style="width: 600px; height: 400px;">
            <h4 style="margin: 0 0 10px 0; color: #666;">High Contrast Theme</h4>
            <ak-monaco
                value=${ifDefined(args.value)}
                language=${ifDefined(args.language)}
                theme=${ifDefined(args.theme)}
            ></ak-monaco>
        </div>
    `,
};

export const CustomSizing: Story = {
    args: {
        value: "// Small editor example\nconsole.log('Compact code editor');",
        language: "javascript",
        theme: "vs-dark",
    },
    render: (args) => html`
        <style>
            .custom-sized {
                --ak-monaco-width: 400px;
                --ak-monaco-height: 200px;
                --ak-monaco-border: 2px solid #007acc;
                --ak-monaco-border-radius: 12px;
            }
        </style>
        <div>
            <h4 style="margin: 0 0 10px 0; color: #666;">Custom Sized Editor (400x200px)</h4>
            <ak-monaco
                class="custom-sized"
                value=${ifDefined(args.value)}
                language=${ifDefined(args.language)}
                theme=${ifDefined(args.theme)}
            ></ak-monaco>
        </div>
    `,
};

export const WithEventHandling: Story = {
    args: {
        value: "// Try editing this code to see events in action\nconst message = 'Hello Monaco!';\nconsole.log(message);",
        language: "javascript",
        theme: "vs-dark",
    },
    render: (args) => html`
        <div style="width: 650px;">
            <div style="display: flex; gap: 20px; margin-bottom: 15px;">
                <div>
                    <strong>Event Log:</strong>
                    <div id="event-log" style="
                        background: #f5f5f5;
                        padding: 10px;
                        border-radius: 4px;
                        min-height: 60px;
                        font-family: monospace;
                        font-size: 12px;
                        width: 200px;
                        max-height: 150px;
                        overflow-y: auto;
                    ">
                        Waiting for events...
                    </div>
                </div>
            </div>
            <div style="height: 300px;">
                <ak-monaco
                    value=${ifDefined(args.value)}
                    language=${ifDefined(args.language)}
                    theme=${ifDefined(args.theme)}
                    @value-changed=${(e: CustomEvent) => {
                        const log = document.getElementById('event-log');
                        if (log) {
                            const time = new Date().toLocaleTimeString();
                            log.innerHTML = `${time}: Value changed<br>Length: ${e.detail.value.length} chars<br>` + log.innerHTML;
                        }
                    }}
                    @editor-ready=${() => {
                        const log = document.getElementById('event-log');
                        if (log) {
                            log.innerHTML = `${new Date().toLocaleTimeString()}: Editor ready<br>` + log.innerHTML;
                        }
                    }}
                ></ak-monaco>
            </div>
        </div>
    `,
};

export const UsingBuilderFunction: Story = {
    args: {
        value: "// Created with akMonaco() builder function\nconst greeting = 'Hello from builder!';\nconsole.log(greeting);",
        language: "javascript",
        theme: "vs-dark",
    },
    render: (args) => html`
        <div style="width: 600px; height: 350px; padding: 20px; border: 1px dashed #ccc;">
            <h4 style="margin-top: 0;">Created with akMonaco() helper function</h4>
            ${akMonaco({
                value: args.value,
                language: args.language,
                theme: args.theme,
                options: {
                    fontSize: 14,
                    lineNumbers: "on",
                    minimap: { enabled: false },
                },
            })}
            <p style="font-size: 12px; color: #666; margin-bottom: 0; margin-top: 10px;">
                <code>akMonaco({ value: "${args.value?.substring(0, 30)}...", language: "${args.language}", theme: "${args.theme}" })</code>
            </p>
        </div>
    `,
};

export const ResponsiveEditor: Story = {
    args: {
        value: "// This editor adapts to different screen sizes\nfunction responsiveFunction() {\n    console.log('Responsive design!');\n}",
        language: "javascript",
        theme: "vs-dark",
    },
    render: (args) => html`
        <style>
            .responsive-monaco {
                width: 100%;
                height: 300px;
            }
            
            @media (max-width: 768px) {
                .responsive-monaco {
                    --ak-monaco-height: 200px;
                }
            }
            
            @media (max-width: 480px) {
                .responsive-monaco {
                    --ak-monaco-height: 150px;
                }
            }
            
            .demo-container {
                width: 100%;
                max-width: 700px;
                padding: 20px;
                border: 1px dashed #ccc;
            }
        </style>
        <div class="demo-container">
            <h4 style="margin-top: 0;">Responsive Monaco Editor</h4>
            <p style="font-size: 14px; color: #666;">
                This editor adjusts its height based on screen size:<br>
                • Desktop: 300px height<br>
                • Tablet (≤768px): 200px height<br>
                • Mobile (≤480px): 150px height
            </p>
            <ak-monaco
                class="responsive-monaco"
                value=${ifDefined(args.value)}
                language=${ifDefined(args.language)}
                theme=${ifDefined(args.theme)}
            ></ak-monaco>
        </div>
    `,
};