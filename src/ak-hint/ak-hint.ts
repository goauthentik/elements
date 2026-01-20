import { akHint, type HintProps } from "./ak-hint.builder.js";
import { Hint } from "./ak-hint.component.js";

export { akHint, Hint, HintProps };

window.customElements.define("ak-hint", Hint);

declare global {
    interface HTMLElementTagNameMap {
        "ak-hint": Hint;
    }
}
