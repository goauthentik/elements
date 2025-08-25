import { customElement } from "../utils/customElement.js";
import { akBrand } from "./ak-brand.builder.js";
import { Brand } from "./ak-brand.component.js";

export { akBrand, Brand };

customElement("ak-brand", Brand);

declare global {
    interface HTMLElementTagNameMap {
        "ak-brand": Brand;
    }
}
