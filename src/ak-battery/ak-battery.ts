import { akBattery, type BatteryProps } from "./ak-battery.builder.js";
import { Battery, batterySeverities, type BatterySeverity } from "./ak-battery.component.js";

export { akBattery, Battery, BatteryProps, batterySeverities, BatterySeverity };

window.customElements.define("ak-battery", Battery);

declare global {
    interface HTMLElementTagNameMap {
        "ak-battery": Battery;
    }
}
