import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import styles from "./ak-icon.css";
import { styles as icons } from "../css/base/fa-icons.css";
import { styles as pficons } from "../css/base/pf-icons.css";
import { icons as iconNames } from "./iconUnicodes.js";

const processedIconNames = new Map(
    Object.entries(iconNames)
        .map(([key, value]) => [[key, value], [key.replace(/^(fa|pf-icon)-/, "", value)]])
        .flat()
);

export class Icon extends LitElement {
    static readonly styles = [styles, icons, pficons];

    @property()
    icon: string = "fa-question";

    render() {
        const icon = "fa-question";
        return html`<span part="content"><i class="fa ${icon}"></i></span>`;
    }
}
