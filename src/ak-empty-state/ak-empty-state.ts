import { customElement } from "../utils/customElement.js";
import { akEmptyState } from "./ak-empty-state.builder.js";
import { EmptyState, type IEmptyState } from "./ak-empty-state.component.js";

export { EmptyState, akEmptyState, IEmptyState };

customElement("ak-empty-state", EmptyState);

declare global {
    interface HTMLElementTagNameMap {
        "ak-empty-state": EmptyState;
    }
}
