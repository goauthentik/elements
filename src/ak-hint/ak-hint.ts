import { customElement } from "../utils/customElement.js";
import { akHint, type AkHintProps } from "./ak-hint.builder.js";
import { Hint } from "./ak-hint.component.js";

export { Hint, akHint, AkHintProps };

customElement("ak-hint", Hint);

declare global {
    interface HTMLElementTagNameMap {
        "ak-hint": Hint;
    }
}
