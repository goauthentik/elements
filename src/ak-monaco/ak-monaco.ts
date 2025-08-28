import { akMonaco, type AkMonacoProps } from "./ak-monaco.builder.js";
import { Monaco, type IMonaco } from "./ak-monaco.component.js";

export { akMonaco, type AkMonacoProps, Monaco, type IMonaco };

window.customElements.define("ak-monaco", Monaco);

declare global {
    interface HTMLElementTagNameMap {
        "ak-monaco": Monaco;
    }
}