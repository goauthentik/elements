import { akEmptyState, EmptyStateProps } from "./ak-empty-state.builder.js";
import { EmptyState } from "./ak-empty-state.component.js";

export { akEmptyState, EmptyState, type EmptyStateProps };

window.customElements.define("ak-empty-state", EmptyState);

declare global {
    interface HTMLElementTagNameMap {
        "ak-empty-state": EmptyState;
    }
}
