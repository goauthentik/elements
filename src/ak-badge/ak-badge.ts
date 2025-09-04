import { akBadge } from "./ak-badge.builder.js";
import { Badge } from "./ak-badge.component.js";

export { akBadge, Badge };

window.customElements.define("ak-badge", Badge);

declare global {
    interface HTMLElementTagNameMap {
        "ak-badge": Badge;
    }
}
