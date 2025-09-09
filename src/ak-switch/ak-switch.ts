import { customElement } from "../utils/customElement.js";
import { akSwitch } from "./ak-switch.builder.js";
import { SwitchInput } from "./ak-switch.component.js";

export { SwitchInput, akSwitch };

customElement("ak-switch", SwitchInput);

declare global {
    interface HTMLElementTagNameMap {
        "ak-switch": SwitchInput;
    }
}
