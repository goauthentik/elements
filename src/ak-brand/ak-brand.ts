import { akBrand, type BrandProps } from "./ak-brand.builder.js";
import { Brand } from "./ak-brand.component.js";

export { akBrand, Brand, type BrandProps };

window.customElements.define("ak-brand", Brand);

declare global {
    interface HTMLElementTagNameMap {
        "ak-brand": Brand;
    }
}
