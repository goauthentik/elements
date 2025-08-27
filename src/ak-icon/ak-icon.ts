import { akIcon, type AkIconProps } from "./ak-icon.builder.js";
import { Icon, type IIcon } from "./ak-icon.component.js";

export { akIcon, type AkIconProps, Icon, type IIcon };

window.customElements.define("ak-icon", Icon);

declare global {
    interface HTMLElementTagNameMap {
        "ak-icon": Icon;
    }
}
