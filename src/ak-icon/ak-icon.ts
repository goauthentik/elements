import { akIcon, type AkIconProps } from "./ak-icon.builder.js";
import { Icon } from "./ak-icon.component.js";

export { akIcon, AkIconProps, Icon };

window.customElements.define("ak-icon", Icon);

declare global {
    interface HTMLElementTagNameMap {
        "ak-icon": Icon;
    }
}
