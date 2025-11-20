import { customElement } from "../utils/customElement.js";
import { akDisclosure } from "./ak-disclosure.builder.js";
import { Disclosure } from "./ak-disclosure.component.js";

export { akDisclosure, Disclosure };

customElement("ak-disclosure", Disclosure);

declare global {
    interface HTMLElementTagNameMap {
        "ak-disclosure": Disclosure;
    }
}
