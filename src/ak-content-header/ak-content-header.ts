import { ContentHeader, type IContentHeader } from "./ak-content-header.component.js";

export { ContentHeader, type IContentHeader };

window.customElements.define("ak-content-header", ContentHeader);

declare global {
    interface HTMLElementTagNameMap {
        "ak-content-header": ContentHeader;
    }
}
