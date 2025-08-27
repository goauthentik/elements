import { Icon } from "./ak-icon.component.js";
import { akIcon, type AkIconProps } from "./ak-icon.builder.js";

export { Icon, akIcon, AkIconProps };

window.customElements.define("ak-icon", Icon);

declare global {
    interface HTMLElementTagNameMap {
        "ak-icon": Icon;
    }
}
