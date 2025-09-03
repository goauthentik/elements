import { akStack } from "./ak-stack.builder.js";
import { Stack } from "./ak-stack.component.js";

export { akStack, Stack };

window.customElements.define("ak-stack", Stack);

declare global {
    interface HTMLElementTagNameMap {
        "ak-stack": Stack;
    }
}
