import { akSwitch, type SwitchProps } from "./ak-switch.builder.js";
import { SwitchInput, type ISwitchInput } from "./ak-switch.component.js";

export { akSwitch, type SwitchProps, SwitchInput, type ISwitchInput };

window.customElements.define("ak-switch", SwitchInput);

declare global {
    interface HTMLElementTagNameMap {
        "ak-switch": SwitchInput;
    }
}
