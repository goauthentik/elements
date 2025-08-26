import { customElement } from "../utils/customElement.js";
import { Icon } from "./ak-icon.component.js";

export { Icon };

customElement("ak-icon", Icon);

declare global {
    interface HTMLElementTagNameMap {
        "ak-icon": Icon;
    }
}
