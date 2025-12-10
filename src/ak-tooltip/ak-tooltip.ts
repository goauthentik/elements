import { akTooltip, type TooltipProps } from "./ak-tooltip.builder.js";
import { Tooltip } from "./ak-tooltip.component.js";

export { akTooltip, Tooltip, type TooltipProps };

window.customElements.define("ak-tooltip", Tooltip);

declare global {
    interface HTMLElementTagNameMap {
        "ak-tooltip": Tooltip;
    }
}
