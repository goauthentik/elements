import { akDivider, type DividerProps } from "./ak-divider.builder.js";
import { Divider } from "./ak-divider.component.js";

export { akDivider, Divider, type DividerProps };

window.customElements.define("ak-divider", Divider);

declare global {
    interface HTMLElementTagNameMap {
        "ak-divider": Divider;
    }
}
