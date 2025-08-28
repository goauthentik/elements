import { Monaco } from "./ak-monaco.component.js";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type AkMonacoProps = Partial<Pick<Monaco, "value" | "language" | "readOnly" | "theme" | "options">>;

export function akMonaco(options: AkMonacoProps = {}) {
    const { value, language, readOnly, theme, options: editorOptions } = options;
    return html`<ak-monaco
        value=${ifDefined(value)}
        language=${ifDefined(language)}
        ?read-only=${readOnly}
        theme=${ifDefined(theme)}
        .options=${editorOptions}
    ></ak-monaco>`;
}