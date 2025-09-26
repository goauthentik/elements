import { akSkipToContent, type SkipToContentProps } from "./ak-skip-to-content.builder.js";
import { SkipToContent } from "./ak-skip-to-content.component.js";

export { akSkipToContent, SkipToContent, type SkipToContentProps };

window.customElements.define("ak-skip-to-content", SkipToContent);

declare global {
    interface HTMLElementTagNameMap {
        "ak-skip-to-content": SkipToContent;
    }
}
