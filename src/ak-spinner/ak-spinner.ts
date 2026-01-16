import { akSpinner } from "./ak-spinner.builder.js";
import { Spinner } from "./ak-spinner.component.js";

export { akSpinner, Spinner };

window.customElements.define("ak-spinner", Spinner);

declare global {
    interface HTMLElementTagNameMap {
        "ak-spinner": Spinner;
    }
}
