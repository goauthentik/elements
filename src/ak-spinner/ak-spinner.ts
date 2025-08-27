import { customElement } from "../utils/customElement.js";
import { akSpinner } from "./ak-spinner.builder.js";
import { Spinner } from "./ak-spinner.component.js";

export { Spinner, akSpinner };

customElement("ak-spinner", Spinner);

declare global {
    interface HTMLElementTagNameMap {
        "ak-spinner": Spinner;
    }
}
