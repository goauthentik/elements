import { akSwitch, type SwitchProps } from "./ak-switch.builder.js";
import { SwitchInput } from "./ak-switch.component.js";

export { akSwitch, SwitchInput, type SwitchProps };

window.customElements.define("ak-switch", SwitchInput);

declare global {
    interface HTMLElementTagNameMap {
        "ak-switch": SwitchInput;
    }
}
