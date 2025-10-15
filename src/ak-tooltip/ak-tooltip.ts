import { akTooltip } from "./ak-tooltip.builder.js";
import { Tooltip } from "./ak-tooltip.component.js";

export { akTooltip, Tooltip };

window.customElements.define("ak-tooltip", Tooltip);

/* To use the debugging version:
 * ```
 *    import { ToolTipWithHover } from "./ak-tooltip.debug.js";
 *    window.customElements.define("ak-tooltip", TooltipWithHover(Tooltip));
 * ```
 */

declare global {
    interface HTMLElementTagNameMap {
        "ak-tooltip": Tooltip;
    }
}
