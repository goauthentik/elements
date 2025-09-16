import { akCheckbox, type CheckboxProps } from "./ak-checkbox.builder.js";
import { CheckboxInput, type ICheckboxInput } from "./ak-checkbox.component.js";

export { akCheckbox, CheckboxInput, type CheckboxProps, type ICheckboxInput };

window.customElements.define("ak-checkbox", CheckboxInput);

declare global {
    interface HTMLElementTagNameMap {
        "ak-checkbox": CheckboxInput;
    }
}
