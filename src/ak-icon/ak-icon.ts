import { Icon } from "./ak-icon.component.js";

export { Icon };

window.customElements.define("ak-icon", Icon);

declare global {
    interface HTMLElementTagNameMap {
        "ak-icon": Icon;
    }
}
