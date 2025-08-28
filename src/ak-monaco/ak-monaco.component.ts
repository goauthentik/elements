import styles from "./ak-monaco.css";

import { html, LitElement, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import * as monaco from "monaco-editor";
import type { editor } from "monaco-editor";

export interface IMonaco {
    value?: string;
    language?: string;
    readOnly?: boolean;
    theme?: string;
    options?: editor.IStandaloneEditorConstructionOptions;
}

export class Monaco extends LitElement implements IMonaco {
    static readonly styles = [styles];

    protected readonly editorContainerRef = createRef<HTMLDivElement>();
    protected editor?: editor.IStandaloneCodeEditor;

    @property({ type: String, reflect: true })
    value = "";

    @property({ type: String, reflect: true })
    language = "javascript";

    @property({ type: Boolean, reflect: true, attribute: "read-only" })
    readOnly = false;

    @property({ type: String, reflect: true })
    theme = "vs-dark";

    @property({ type: Object })
    options?: editor.IStandaloneEditorConstructionOptions;

    async firstUpdated() {
        await this.initializeMonaco();
        await this.createEditor();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.editor?.dispose();
    }

    protected async initializeMonaco() {
        if (!document.querySelector('link[href*="monaco-editor"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = new URL('monaco-editor/min/vs/editor/editor.main.css', import.meta.url).href;
            document.head.appendChild(link);
        }

        (self as any).MonacoEnvironment = {
            getWorker(_: any, label: string) {
                const getWorkerModule = (path: string) => {
                    return new Worker(new URL(path, import.meta.url));
                };
                
                switch (label) {
                    case "json":
                        return getWorkerModule('monaco-editor/esm/vs/language/json/json.worker.js');
                    case "css":
                    case "scss":
                    case "less":
                        return getWorkerModule('monaco-editor/esm/vs/language/css/css.worker.js');
                    case "html":
                    case "handlebars":
                    case "razor":
                        return getWorkerModule('monaco-editor/esm/vs/language/html/html.worker.js');
                    case "typescript":
                    case "javascript":
                        return getWorkerModule('monaco-editor/esm/vs/language/typescript/ts.worker.js');
                    default:
                        return getWorkerModule('monaco-editor/esm/vs/editor/editor.worker.js');
                }
            },
        };
    }

    protected async createEditor() {
        if (!this.editorContainerRef.value) return;

        await new Promise(resolve => setTimeout(resolve, 0));

        const options: editor.IStandaloneEditorConstructionOptions = {
            value: this.value,
            language: this.language,
            theme: this.theme,
            readOnly: this.readOnly,
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
            lineNumbers: "on" as editor.LineNumbersType,
            wordWrap: "on",
            tabSize: 2,
            insertSpaces: true,
            fontLigatures: false,
        };

        this.editor = monaco.editor.create(this.editorContainerRef.value, {
            ...options,
            ...this.options,
        });

        this.editor.onDidChangeModelContent(() => {
            const currentValue = this.editor?.getValue() || "";
            if (currentValue !== this.value) {
                this.value = currentValue;
                this.dispatchEvent(new CustomEvent("value-changed", {
                    detail: { value: currentValue },
                    bubbles: true,
                    composed: true,
                }));
            }
        });

        this.dispatchEvent(new CustomEvent("editor-ready", {
            detail: this.editor,
            bubbles: true,
            composed: true,
        }));
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        if (!this.editor) return;

        if (changedProperties.has("value")) {
            const currentValue = this.editor.getValue();
            if (currentValue !== this.value) {
                this.editor.setValue(this.value);
            }
        }

        if (changedProperties.has("language")) {
            const model = this.editor.getModel();
            if (model) {
                monaco.editor.setModelLanguage(model, this.language);
            }
        }

        if (changedProperties.has("theme")) {
            monaco.editor.setTheme(this.theme);
        }

        if (changedProperties.has("readOnly")) {
            this.editor.updateOptions({ readOnly: this.readOnly });
        }

        if (changedProperties.has("options")) {
            this.editor.updateOptions(this.options || {});
        }
    }

    render() {
        return html`<div
            ${ref(this.editorContainerRef)}
            part="editor-container"
            class="monaco-editor-container"
        ></div>`;
    }

    getEditor(): editor.IStandaloneCodeEditor | undefined {
        return this.editor;
    }

    getValue(): string {
        return this.editor?.getValue() || "";
    }

    setValue(value: string): void {
        this.value = value;
        this.editor?.setValue(value);
    }

    focus(): void {
        this.editor?.focus();
    }

    insertText(text: string): void {
        this.editor?.trigger("keyboard", "type", { text });
    }
}