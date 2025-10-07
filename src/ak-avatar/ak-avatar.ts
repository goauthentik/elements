import { akAvatar } from "./ak-avatar.builder.js";
import { Avatar } from "./ak-avatar.component.js";

export { akAvatar, Avatar };

window.customElements.define("ak-avatar", Avatar);

declare global {
    interface HTMLElementTagNameMap {
        "ak-avatar": Avatar;
    }
}
