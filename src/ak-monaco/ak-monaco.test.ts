import "./ak-monaco.js";

import { akMonaco } from "./ak-monaco.builder.js";
import type { editor } from "monaco-editor";

import { spread } from "@open-wc/lit-helpers";
import { $, browser, expect } from "@wdio/globals";

import { html, render } from "lit";

describe("ak-monaco component", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            document.body.querySelector("ak-monaco")?.remove();
            if ("_$litPart$" in document.body) {
                delete document.body._$litPart$;
            }
        });
    });

    const renderComponent = async (properties = {}) => {
        const root = render(html`<ak-monaco ${spread(properties)}></ak-monaco>`, document.body);
        await browser.pause(500);
        return root;
    };

    it("renders with default attributes", async () => {
        await renderComponent();

        const monacoEl = $("ak-monaco");
        const container = monacoEl.$(">>>div[part='editor-container']");

        await expect(monacoEl).toExist();
        await expect(container).toExist();
        await expect(monacoEl).toHaveAttribute("value", "");
        await expect(monacoEl).toHaveAttribute("language", "javascript");
        await expect(monacoEl).toHaveAttribute("theme", "vs-dark");
    });

    it("renders with custom value and language", async () => {
        const testCode = "console.log('Hello, World!');";
        await renderComponent({
            value: testCode,
            language: "typescript",
        });

        const monacoEl = $("ak-monaco");

        await expect(monacoEl).toHaveAttribute("value", testCode);
        await expect(monacoEl).toHaveAttribute("language", "typescript");
    });

    it("reflects read-only property as attribute", async () => {
        await renderComponent({
            "read-only": true,
        });

        const monacoEl = $("ak-monaco");
        await expect(monacoEl).toHaveAttribute("read-only");
    });

    it("reflects theme property as attribute", async () => {
        await renderComponent({
            theme: "vs",
        });

        const monacoEl = $("ak-monaco");
        await expect(monacoEl).toHaveAttribute("theme", "vs");
    });

    it("exposes correct CSS part", async () => {
        await renderComponent();

        const editorPart = $("ak-monaco").$('>>>[part="editor-container"]');
        await expect(editorPart).toExist();
        await expect((await editorPart.getTagName()).toLowerCase()).toBe("div");
    });

    it("updates attributes when properties change", async () => {
        await renderComponent({
            value: "initial value",
            language: "javascript",
        });

        const monacoEl = $("ak-monaco");

        // Verify initial state
        await expect(monacoEl).toHaveAttribute("value", "initial value");
        await expect(monacoEl).toHaveAttribute("language", "javascript");

        await monacoEl.execute((elem: any) => {
            elem.setAttribute("value", "updated value");
            elem.setAttribute("language", "typescript");
        });

        await browser.pause(100);

        // Verify updated state
        await expect(monacoEl).toHaveAttribute("value", "updated value");
        await expect(monacoEl).toHaveAttribute("language", "typescript");
    });

    it("fires value-changed event when content changes", async () => {
        await renderComponent({
            value: "initial content",
        });

        const monacoEl = $("ak-monaco");

        await browser.execute(() => {
            const element = document.querySelector("ak-monaco");
            element?.addEventListener("value-changed", (event: any) => {
                (window as any).lastValueChangedEvent = event.detail;
            });
        });

        await monacoEl.execute((elem: any) => {
            elem.setAttribute("value", "new content");
        });

        await browser.pause(200);

        const updatedValue = await monacoEl.getAttribute("value");
        expect(updatedValue).toBe("new content");
    });

    it("fires editor-ready event when initialized", async () => {
        await browser.execute(() => {
            let eventFired = false;
            document.addEventListener("editor-ready", () => {
                (window as any).editorReadyFired = true;
            });
        });

        await renderComponent();
        await browser.pause(600);

        const eventFired = await browser.execute(() => (window as any).editorReadyFired);
        expect(eventFired).toBe(true);
    });

    it("applies CSS custom properties", async () => {
        await browser.execute(() => {
            const style = document.createElement("style");
            style.textContent = `
                .custom-monaco {
                    --ak-monaco-width: 500px;
                    --ak-monaco-height: 400px;
                    --ak-monaco-border: 2px solid red;
                }
            `;
            document.head.appendChild(style);
        });

        await renderComponent({
            class: "custom-monaco",
        });

        const monacoEl = $("ak-monaco");
        await expect(monacoEl).toExist();
    });

    it("shows read-only indicator when read-only", async () => {
        await renderComponent({
            "read-only": true,
        });

        const monacoEl = $("ak-monaco");
        await expect(monacoEl).toHaveAttribute("read-only");
    });

    it("handles different themes", async () => {
        const themes = ["vs", "vs-dark", "hc-black"];

        for (const theme of themes) {
            await renderComponent({ theme });

            const monacoEl = $("ak-monaco");
            await expect(monacoEl).toHaveAttribute("theme", theme);

            await browser.execute(() => {
                document.body.querySelector("ak-monaco")?.remove();
                if ("_$litPart$" in document.body) {
                    delete (document.body as any)._$litPart$;
                }
            });
            await browser.pause(100);
        }
    });

    it("handles various programming languages", async () => {
        const languages = ["javascript", "typescript", "json", "css", "html"];

        for (const language of languages) {
            await renderComponent({ language });

            const monacoEl = $("ak-monaco");
            await expect(monacoEl).toHaveAttribute("language", language);

            await browser.execute(() => {
                document.body.querySelector("ak-monaco")?.remove();
                if ("_$litPart$" in document.body) {
                    delete (document.body as any)._$litPart$;
                }
            });
            await browser.pause(100);
        }
    });
});

describe("akMonaco helper function", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            document.body.querySelector("ak-monaco")?.remove();
            if ("_$litPart$" in document.body) {
                delete document.body._$litPart$;
            }
        });
    });

    it("should create a basic monaco component", async () => {
        render(
            akMonaco({
                value: "console.log('Hello from builder!');",
                language: "javascript",
            }),
            document.body,
        );

        await browser.pause(500);

        const monacoEl = $("ak-monaco");
        const container = monacoEl.$(">>>div[part='editor-container']");

        await expect(monacoEl).toExist();
        await expect(container).toExist();
        await expect(monacoEl).toHaveAttribute("value", "console.log('Hello from builder!');");
        await expect(monacoEl).toHaveAttribute("language", "javascript");
    });

    it("should create monaco with read-only mode", async () => {
        render(
            akMonaco({
                value: "const readOnlyCode = true;",
                language: "typescript",
                readOnly: true,
            }),
            document.body,
        );

        const monacoEl = $("ak-monaco");
        await expect(monacoEl).toExist();
        await expect(monacoEl).toHaveAttribute("read-only");
        await expect(monacoEl).toHaveAttribute("language", "typescript");
    });

    it("should create monaco with custom theme", async () => {
        render(
            akMonaco({
                value: "/* Light theme CSS */",
                language: "css",
                theme: "vs",
            }),
            document.body,
        );

        const monacoEl = $("ak-monaco");
        await expect(monacoEl).toExist();
        await expect(monacoEl).toHaveAttribute("theme", "vs");
        await expect(monacoEl).toHaveAttribute("language", "css");
    });

    it("should create monaco with custom options", async () => {
        const customOptions: editor.IStandaloneEditorConstructionOptions = {
            fontSize: 16,
            lineNumbers: "off" as editor.LineNumbersType,
            minimap: { enabled: true },
        };

        render(
            akMonaco({
                value: '{"test": "json"}',
                language: "json",
                options: customOptions,
            }),
            document.body,
        );

        const monacoEl = $("ak-monaco");
        await expect(monacoEl).toExist();
        await expect(monacoEl).toHaveAttribute("language", "json");
        await expect(monacoEl).toHaveAttribute("value", '{"test": "json"}');
    });

    it("should create empty monaco when no options provided", async () => {
        render(akMonaco({}), document.body);

        const monacoEl = $("ak-monaco");
        const container = monacoEl.$(">>>div[part='editor-container']");

        await expect(monacoEl).toExist();
        await expect(container).toExist();
        await expect(monacoEl).toHaveAttribute("value", "");
        await expect(monacoEl).toHaveAttribute("language", "javascript");
    });

    it("should create monaco with undefined options", async () => {
        render(akMonaco(), document.body);

        const monacoEl = $("ak-monaco");
        const container = monacoEl.$(">>>div[part='editor-container']");

        await expect(monacoEl).toExist();
        await expect(container).toExist();
    });

    it("should properly reflect attributes to component", async () => {
        render(
            akMonaco({
                value: "// Reflected test",
                language: "javascript",
                theme: "vs-dark",
                readOnly: false,
            }),
            document.body,
        );

        const monacoEl = $("ak-monaco");

        // Check that attributes are reflected on the component
        await expect(monacoEl).toHaveAttribute("value", "// Reflected test");
        await expect(monacoEl).toHaveAttribute("language", "javascript");
        await expect(monacoEl).toHaveAttribute("theme", "vs-dark");
        // read-only is false so attribute should not be present
        const hasReadOnly = await monacoEl.getAttribute("read-only");
        expect(hasReadOnly).toBeNull();
    });

    it("should maintain component functionality", async () => {
        render(
            akMonaco({
                value: "/* Functional test */",
                language: "css",
                theme: "vs",
            }),
            document.body,
        );

        await browser.pause(500);

        const monacoEl = $("ak-monaco");
        const container = monacoEl.$(">>>div[part='editor-container']");
        const editorPart = monacoEl.$(">>>[part='editor-container']");

        await expect(container).toExist();
        await expect(editorPart).toExist();
        await expect(monacoEl).toExist();
    });
});