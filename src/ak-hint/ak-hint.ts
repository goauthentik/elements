import { customElement } from "../utils/customElement.js";
import { akHint, type HintProps } from "./ak-hint.builder.js";
import { Hint } from "./ak-hint.component.js";

export { akHint, Hint, HintProps };

customElement("ak-hint", Hint);

declare global {
    interface HTMLElementTagNameMap {
        "ak-hint": Hint;
    }
}
