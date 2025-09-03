import { customElement } from "../utils/customElement.js";
import { akDivider, type DividerProps } from "./ak-divider.builder.js";
import { Divider, type IDivider } from "./ak-divider.component.js";

export { akDivider, Divider, type IDivider, type DividerProps };

customElement("ak-divider", Divider);

declare global {
    interface HTMLElementTagNameMap {
        "ak-divider": Divider;
    }
}
