import { akEmptyState } from "./ak-empty-state.builder.js";
import { EmptyState, type IEmptyState } from "./ak-empty-state.component.js";

export { akEmptyState, EmptyState, IEmptyState };

window.customElements.define("ak-empty-state", EmptyState);

declare global {
    interface HTMLElementTagNameMap {
        "ak-empty-state": EmptyState;
    }
}
