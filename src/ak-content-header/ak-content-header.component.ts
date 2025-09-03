import styles from "./ak-content-header.css";

import { html, nothing } from "lit";
import { AkLitElement } from "../component-base.js";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import "../ak-icon/ak-icon.js";
import "../ak-divider/ak-divider.js";

export interface IContentHeader {
    icon?: string;
}

/**
 * @summary A **contentheader** is an image used to identify an organization, corporation or project.
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
            return html`<ak-icon part="icon-content" icon=${this.icon} size="3x"></ak-icon>`;
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
                ${icon || this.icon
                    ? html`<div part="icon">${this.renderIcon(icon)}</div>
                          <div part="divider">
                              <ak-divider orientation="vertical"></ak-divider>
                          </div>`
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
