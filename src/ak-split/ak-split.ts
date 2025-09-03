import { akSplit } from "./ak-split.builder.js";
import { Split } from "./ak-split.component.js";

export { akSplit, Split };

window.customElements.define("ak-split", Split);

declare global {
    interface HTMLElementTagNameMap {
        "ak-split": Split;
    }
}
