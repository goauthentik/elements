import { akContentHeader, type ContentHeaderProps } from "./ak-content-header.builder.js";
import { ContentHeader, type IContentHeader } from "./ak-content-header.component.js";

export { akContentHeader, ContentHeader, type ContentHeaderProps, type IContentHeader };

window.customElements.define("ak-content-header", ContentHeader);

declare global {
    interface HTMLElementTagNameMap {
        "ak-content-header": ContentHeader;
    }
}
