import styles from "./ak-content-header.css";

import { html, nothing } from "lit";
import { AkLitElement } from "../component-base.js";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

export interface IContentHeader {
    icon?: string;
}

/**
 * @summary A **contentheader** is an image used to identify an organization, corporation or project.
 *
 * @csspart contentheader - The image element within the component
 *
 */
export class ContentHeader extends AkLitElement implements IContentHeader {
    static readonly styles = [styles];

    /** @attr {string} icon - the name of the icon to show, if not using the slot. */
    @property({ type: String })
    public icon?: string;

    private renderIcon(hasSlottedIcon = false) {
        if (hasSlottedIcon) {
            return html`<div part="icon-content"><slot name="icon"></slot></div>`;
        }
        if (this.icon) {
            return html`<ak-icon part="icon-content" icon=${this.icon}></ak-icon>`;
        }
        return nothing;
    }

    render() {
        const [breadcrumbs, icon, title, subtitle] = [
            "breadcrumbs",
            "icon",
            "title",
            "subtitle",
        ].map((slotname) => this.hasSlotted(slotname));

        return html` <div part="content-header">
            ${breadcrumbs
                ? html`<div part="breadcrumbs"><slot name="breadcrumbs"></slot></div>`
                : nothing}
            <div part="header-main">
                ${icon
                    ? html`<div part="icon">${this.renderIcon(icon)}<ak-divider orientation="vertical"></div>`
                    : nothing}
                <div part="header-titles">
                    <div part="title"><slot name="title"></slot></div>
                    ${subtitle
                        ? html`<div part="subtitle"><slot name="subtitle"></slot></div>`
                        : nothing}
                </div>
            </div>
        </div>`;
    }
}
