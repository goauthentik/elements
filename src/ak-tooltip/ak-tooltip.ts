import { akTooltip, type TooltipProps } from "./ak-tooltip.builder.js";
import { Tooltip } from "./ak-tooltip.component.js";

// window.customElements.define("ak-tooltip", Tooltip);
// To use the debugging version:
// ```
// import { TooltipWithHover } from "./ak-tooltip.debug.js";
// window.customElements.define("ak-tooltip", TooltipWithHover(Tooltip));
// ```
//

window.customElements.define("ak-tooltip", Tooltip);

export { akTooltip, Tooltip, type TooltipProps };

declare global {
    interface HTMLElementTagNameMap {
        "ak-tooltip": Tooltip;
    }
}
