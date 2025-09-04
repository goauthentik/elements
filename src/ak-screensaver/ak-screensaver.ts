import { akScreensaver, AkScreensaverProps } from "./ak-screensaver.builder.js";
import { Screensaver } from "./ak-screensaver.component.js";
import { type IScreensaver } from "./types.js";

export { akScreensaver, type AkScreensaverProps, type IScreensaver, Screensaver };

window.customElements.define("ak-screensaver", Screensaver);

declare global {
    interface HTMLElementTagNameMap {
        "ak-screensaver": Screensaver;
    }
}
