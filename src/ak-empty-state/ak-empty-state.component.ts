import "../ak-icon/ak-icon.js";
import "../ak-spinner/ak-spinner.js";

import { AkLitElement } from "../component-base.js";
import styles from "./ak-empty-state.css";

import { msg } from "@lit/localize";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";

/**
 * Size variants for the Empty State component
 */
export const emptyStateSize = ["xs", "sm", "md", "lg", "xl"] as const;
export type EmptyStateSize = (typeof emptyStateSize)[number];
const DEFAULT_SIZE_INDEX = emptyStateSize.indexOf("md");

const isEmptyStateSize = (s?: string): s is EmptyStateSize =>
    typeof s === "string" && s.trim() !== "" && emptyStateSize.includes(s as EmptyStateSize);

const spinnerSizes = ["sm", "md", "lg", "lg", "xl"];
const iconSizes = ["sm", "md", "lg", "xl", "6x"];

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
export class EmptyState extends AkLitElement implements IEmptyState {
    static override get styles() {
        return [styles];
    }

    @property({ type: Boolean, attribute: "no-icon" })
    public noIcon = false;

    @property({ type: Boolean })
    public loading = false;

    @property({ type: String })
    public size = "md";

    private renderDefaultIcon() {
        const index = isEmptyStateSize(this.size)
            ? emptyStateSize.indexOf(this.size)
            : DEFAULT_SIZE_INDEX;
        return this.loading
            ? html`<ak-spinner size=${spinnerSizes[index] ?? "lg"}></ak-spinner>`
            : html`<ak-icon icon="fa fa-cubes" size="${iconSizes[index] ?? "3x"}"></ak-icon>`;
    }

    public override render() {
        const hasIcon = this.hasSlotted("icon");
        const showIcon = hasIcon || !this.noIcon;
        const showBody = this.hasSlotted("body") || this.loading;

        return html`
            <div part="empty-state">
                <div part="content">
                    ${showIcon
                        ? html` <div part="icon">
                              ${hasIcon
                                  ? html`<slot name="icon"></slot>`
                                  : this.renderDefaultIcon()}
                          </div>`
                        : nothing}
                    ${this.hasSlotted("title")
                        ? html`<div part="title-text">
                              <slot name="title"></slot>
                          </div>`
                        : nothing}
                    ${showBody
                        ? html`<div part="body">
                              ${this.hasSlotted("body")
                                  ? html`<slot name="body"></slot></div>`
                                  : msg("Loading...")}
                          </div>`
                        : nothing}
                    ${this.hasSlotted("footer") ||
                    this.hasSlotted("actions") ||
                    this.hasSlotted("secondary-actions")
                        ? html` <div part="footer">
                              ${this.hasSlotted("actions")
                                  ? html`<div part="actions">
                                        <slot name="actions"></slot>
                                    </div>`
                                  : nothing}
                              ${this.hasSlotted("secondary-actions")
                                  ? html`<div part="actions">
                                        <slot name="secondary-actions"></slot>
                                    </div>`
                                  : nothing}
                              ${this.hasSlotted("footer")
                                  ? html`<slot name="footer"></slot>`
                                  : nothing}
                          </div>`
                        : nothing}
                </div>
            </div>
        `;
    }
}
