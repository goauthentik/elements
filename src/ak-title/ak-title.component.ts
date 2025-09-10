import { MutationController } from "@lit-labs/observers/mutation-controller.js";

import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators/property.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { AkLitElement } from "../component-base.js";

import { styles } from "./ak-title.css";
import "../ak-icon/ak-icon.js";

export interface ITitle {
    href?: string;
    noAutoSlot: boolean;
}

/**
 * @element ak-title
 *
 * @summary A title component with optional icons and external links
 *
 * @attr {TitleSize} size - Size variant: "xs", "sm", "md" (default), "lg", "xl", "2xl", "3xl", "4xl"
 * @attr {string} href - URL for external link (shows link icon when provided)
 * @attr {boolean} no-auto-slot - Prevents automatic slotting
 *
 * @slot - Main title text content
 * @slot icon - Optional icon to display before the title text
 *
 * @csspart title - The main container element
 * @csspart start - Container for icon and body content
 * @csspart icon - Container for the icon slot
 * @csspart body - Container for the main text content
 * @csspart link - Container for the external link when href is provided
 *
 * @cssprop --pf-v5-c-title--FontFamily - Font family for the title text
 * @cssprop --pf-v5-c-title--FontWeight - Font weight of the title
 * @cssprop --pf-v5-c-title--LineHeight - Line height of the title text
 * @cssprop --pf-v5-c-title--FontSize - Font size of the title (varies by size attribute)
 * @cssprop --ak-v1-c-title--Gap - Spacing between icon and text, and before link
 * @cssprop --ak-v1-c-title--link--Color - Color of the external link icon
 * @cssprop --ak-v1-c-title--link--hover--Color - Hover color of the external link icon
 * @cssprop --ak-v1-c-title--link--focus--OutlineStyle - Focus outline style for the link
 */
export class Title extends AkLitElement implements ITitle {
    static readonly styles = [styles];

    @property({ type: String })
    href?: string;

    @property({ type: Boolean, attribute: "no-auto-slot" })
    noAutoSlot = false;

    private updateAutoSlot = () => {
        if (this.noAutoSlot || this.querySelectorAll('[slot="icon"]').length > 0) {
            return;
        }
        const icons = [
            ...this.querySelectorAll('i[class~="fa"]'),
            ...this.querySelectorAll('i[class~="fas"]'),
            ...this.querySelectorAll("ak-icon"),
        ];
        if (icons.length !== 1) {
            return;
        }

        const icon = icons[0];
        icon.slot = "icon";
    };

    protected observer = new MutationController(this, {
        config: {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["slot"],
        },
        callback: this.updateAutoSlot,
    });

    public override connectedCallback() {
        super.connectedCallback();
        this.updateAutoSlot();
    }

    render() {
        return html`<div part="title">
            <div part="start">
                ${this.hasSlotted("icon")
                    ? html`<div part="icon"><slot name="icon"></slot></div>`
                    : nothing}
                <div part="body"><slot></slot></div>
            </div>
            ${this.href?.trim()
                ? html`<div part="end">
                      <a part="anchor" href=${ifDefined(this.href)}
                          ><ak-icon part="anchor-icon" icon="fas fa-external-link-alt"></ak-icon
                      ></a>
                  </div>`
                : nothing}
        </div>`;
    }
}
