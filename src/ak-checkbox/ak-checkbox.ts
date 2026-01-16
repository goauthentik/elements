import { akCheckbox, type CheckboxProps } from "./ak-checkbox.builder.js";
import { CheckboxInput } from "./ak-checkbox.component.js";

export { akCheckbox, CheckboxInput, type CheckboxProps };

window.customElements.define("ak-checkbox", CheckboxInput);

declare global {
    interface HTMLElementTagNameMap {
        "ak-checkbox": CheckboxInput;
    }
}
