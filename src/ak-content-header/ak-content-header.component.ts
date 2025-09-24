import styles from "./ak-content-header.css";

import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { DynamicSlotController } from "../controllers/dynamic-slot-controller.js";
import "../ak-icon/ak-icon.js";

export interface IContentHeader {
    icon?: string;
}

/**
 * @summary A **contentheader** is an image used to identify an organization, corporation or project.
 *
 */
export class ContentHeader extends LitElement implements IContentHeader {
    static readonly styles = [styles];

    /** @attr {string} icon - the name of the icon to show, if not using the slot. */
    @property({ type: String })
    public icon?: string;

    #onSlotChange = () => {
        this.requestUpdate();
    };

    #slotsController = new DynamicSlotController(this, this.#onSlotChange);

    private renderIcon(hasSlottedIcon = false) {
        if (hasSlottedIcon) {
            return html`<div part="icon-content"><slot name="icon"></slot></div>`;
        }
        if (this.icon) {
            return html`<ak-icon part="icon-content" icon=${this.icon} size="lg"></ak-icon>`;
        }
        return nothing;
    }

    render() {
        const [hasSlottedIcon, subtitle] = ["icon", "subtitle"].map((slotname) =>
            this.#slotsController.has(slotname)
        );

        return html`<div part="content-header">
            <div part="title-block">
                ${hasSlottedIcon || this.icon
                    ? html`<div part="icon">${this.renderIcon(hasSlottedIcon)}</div>`
                    : nothing}
                <div part="title"><slot name="title"></slot></div>
            </div>
            ${subtitle ? html`<div part="subtitle"><slot name="subtitle"></slot></div>` : nothing}
        </div>`;
    }
}
