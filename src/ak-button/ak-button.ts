import { customElement } from "../utils/customElement.js";
import { akButton } from "./ak-button.builder.js";
import { Button } from "./ak-button.component.js";

export { akButton, Button };

customElement("ak-button", Button);

declare global {
    interface HTMLElementTagNameMap {
        "ak-button": Button;
    }
}
