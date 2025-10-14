import { akTooltip } from "./ak-tooltip.builder.js";
import { Tooltip } from "./ak-tooltip.component.js";

export { akTooltip, Tooltip };

window.customElements.define("ak-tooltip", Tooltip);

declare global {
    interface HTMLElementTagNameMap {
        "ak-tooltip": Tooltip;
    }
}
