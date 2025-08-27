import { SlotController } from "@patternfly/pfe-core/controllers/slot-controller.js";

import { msg } from "@lit/localize";
import { LitElement, TemplateResult, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import styles from "./ak-empty-state.css";

import "../ak-icon/ak-icon.js";
import "../ak-spinner/ak-spinner.js";

/**
 * Size variants for the Empty State component
 */
export const emptyStateSize = ["xs", "sm", "lg", "xl"] as const;
export type EmptyStateSize = (typeof emptyStateSize)[number];

const isEmptyStateSize = (s?: string): s is EmptyStateSize =>
    typeof s === "string" && s.trim() !== "" && emptyStateSize.includes(s as EmptyStateSize);

const spinnerSizes = ["sm", "md", "lg", "xl"];
const iconSizes = ["sm", "lg", "2x", "3x"];

export interface IEmptyState {
    size?: string;
    loading?: boolean;
    noIcon?: boolean;
}

/**
 * @element ak-empty-state
 *
 * @summary A placeholder component displayed when no data is available or data is being loaded
 *
 * @attr {string} size - Size variant: "xs", "sm", "lg", "xl"
 * @attr {boolean} loading - Shows spinner and loading text when true
 * @attr {boolean} no-icon - Hides the default icon when true
 * @attr {boolean} full-height - Makes component take full height of container
 *
 * @slot icon - Icon displayed at the top of the empty state
 * @slot title - Title describing the empty state
 * @slot body - Descriptive text providing additional context
 * @slot footer - Footer content with links, help text, or action buttons
 * @slot actions - Primary action buttons
 * @slot secondary-actions - Secondary action buttons
 *
 * @csspart main - The main container element
 * @csspart content - The content container element
 * @csspart icon - The container for the icon element
 * @csspart title-text - The container for the title
 * @csspart body - The container for the body text
 * @csspart footer - The footer container
 * @csspart actions - The container for the action buttons
 *
 * @cssprop --pf-v5-c-empty-state--PaddingTop - Top padding of the empty state
 * @cssprop --pf-v5-c-empty-state--PaddingRight - Right padding of the empty state
 * @cssprop --pf-v5-c-empty-state--PaddingBottom - Bottom padding of the empty state
 * @cssprop --pf-v5-c-empty-state--PaddingLeft - Left padding of the empty state
 * @cssprop --pf-v5-c-empty-state__content--MaxWidth - Maximum width of content area
 * @cssprop --pf-v5-c-empty-state__icon--FontSize - Font size of the icon
 * @cssprop --pf-v5-c-empty-state__icon--Color - Color of the icon
 * @cssprop --pf-v5-c-empty-state__icon--MarginBottom - Bottom margin of the icon
 * @cssprop --pf-v5-c-empty-state__title-text--FontFamily - Font family of the title
 * @cssprop --pf-v5-c-empty-state__title-text--FontSize - Font size of the title
 * @cssprop --pf-v5-c-empty-state__title-text--FontWeight - Font weight of the title
 * @cssprop --pf-v5-c-empty-state__body--Color - Color of the body text
 * @cssprop --pf-v5-c-empty-state__body--MarginTop - Top margin of the body text
 * @cssprop --pf-v5-c-empty-state__footer--MarginTop - Top margin of the footer
 * @cssprop --pf-v5-c-empty-state__actions--RowGap - Row gap between action elements
 * @cssprop --pf-v5-c-empty-state__actions--ColumnGap - Column gap between action elements


 */
export class EmptyState extends LitElement implements IEmptyState {
    static get styles() {
        return [styles];
    }

    // Track the status of slots
    private slots = new SlotController(
        this,
        "icon",
        "title",
        "body",
        "footer",
        "actions",
        "secondary-actions",
    );

    @property({ type: Boolean, attribute: "no-icon" })
    noIcon = false;

    @property({ type: Boolean })
    loading = false;

    @property({ type: String })
    size = "";

    private renderDefaultIcon() {
        const index = isEmptyStateSize(this.size) ? emptyStateSize.indexOf(this.size) : 1;
        return this.loading
            ? html`<ak-spinner ${spinnerSizes[index] ?? "large"}></ak-spinner>`
            : html`<ak-icon icon="box-open" size="${iconSizes[index] ?? "3x"}"></ak-icon>`;
    }

    render() {
        const hasIcon = this.slots.hasSlotted("icon");
        const showIcon = hasIcon || !this.noIcon;
        const showBody = this.slots.hasSlotted("body") || this.loading;

        return html`
            <div id="main" part="main">
                <div class="content" part="content">
                    ${showIcon
                        ? html` <div class="icon" part="icon">
                              ${hasIcon
                                  ? html`<slot name="icon"></slot>`
                                  : this.renderDefaultIcon()}
                          </div>`
                        : nothing}
                    ${this.slots.hasSlotted("title")
                        ? html`<div class="title-text" part="title-text">
                              <slot name="title"></slot>
                          </div>`
                        : nothing}
                    ${showBody
                        ? html`<div class="body" part="body">
                              ${this.slots.hasSlotted("body")
                                  ? html`<slot name="body"></slot></div>`
                                  : msg("Loading...")}
                          </div>`
                        : nothing}
                    ${this.slots.hasSlotted("footer") ||
                    this.slots.hasSlotted("actions") ||
                    this.slots.hasSlotted("secondary-actions")
                        ? html` <div class="footer" part="footer">
                              ${this.slots.hasSlotted("actions")
                                  ? html`<div class="actions" part="actions">
                                        <slot name="actions"></slot>
                                    </div>`
                                  : nothing}
                              ${this.slots.hasSlotted("secondary-actions")
                                  ? html`<div class="actions" part="actions">
                                        <slot name="secondary-actions"></slot>
                                    </div>`
                                  : nothing}
                              ${this.slots.hasSlotted("footer")
                                  ? html`<slot name="footer"></slot>`
                                  : nothing}
                          </div>`
                        : nothing}
                </div>
            </div>
        `;
    }
}
