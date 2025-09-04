import { customElement } from "../utils/customElement.js";
import { type AkTitleProps, akTitle, titleSize, type TitleSize } from "./ak-title.builder.js";
import { Title } from "./ak-title.component.js";

export { Title, titleSize, TitleSize, AkTitleProps, akTitle };

customElement("ak-title", Title);

declare global {
    interface HTMLElementTagNameMap {
        "ak-title": Title;
    }
}
