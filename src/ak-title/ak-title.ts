import { customElement } from "../utils/customElement.js";
import { akTitle, type AkTitleProps, titleSize, type TitleSize } from "./ak-title.builder.js";
import { Title } from "./ak-title.component.js";

export { akTitle, AkTitleProps, Title, titleSize, TitleSize };

customElement("ak-title", Title);

declare global {
    interface HTMLElementTagNameMap {
        "ak-title": Title;
    }
}
