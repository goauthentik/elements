import { akButton, type ButtonProps } from "./ak-button.builder.js";
import { Button } from "./ak-button.component.js";

export { akButton, Button, type ButtonProps };

window.customElements.define("ak-button", Button);

declare global {
    interface HTMLElementTagNameMap {
        "ak-button": Button;
    }
}
