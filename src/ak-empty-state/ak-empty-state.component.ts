import "../ak-icon/ak-icon.js";
import "../ak-spinner/ak-spinner.js";

import { AkLitElement } from "../component-base.js";
import styles from "./ak-empty-state.css";

import { msg } from "@lit/localize";
import { html, nothing, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

/**
 * Size variants for the Empty State component
 */
export const emptyStateSizes = ["xs", "sm", "md", "lg", "xl"] as const;
export type EmptyStateSize = (typeof emptyStateSizes)[number];
const DEFAULT_SIZE_INDEX = emptyStateSizes.indexOf("md");

const isEmptyStateSize = (s?: string): s is EmptyStateSize =>
    typeof s === "string" && s.trim() !== "" && emptyStateSizes.includes(s as EmptyStateSize);

const spinnerSizes = ["md", "lg", "lg", "xl", "xl"];
const iconSizes = ["sm", "md", "lg", "xl", "6x"];

const VALID_SLOTS = ["icon", "body", "title", "actions", "secondary-actions", "footer"] as const;
type ValidSlot = (typeof VALID_SLOTS)[number];

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
 * @attr {boolean} no-loading-message - Do not shows the (localized) text "Loading..." when `loading` is true
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
 * @csspart empty-state - The main container element
 * @csspart content - The content container element
 * @csspart icon - The container for the icon element
 * @csspart title - The container for the title
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
    static override readonly styles = [styles];

    @property({ type: String })
    public icon?: string;

    @property({ type: Boolean, attribute: "no-icon" })
    public noIcon = false;

    @property({ type: Boolean, reflect: true, attribute: "no-loading-message" })
    public noLoadingMessage = false;

    @property({ type: Boolean })
    public loading = false;

    @property({ type: String })
    public size = "lg";

    private slotted: Record<ValidSlot, boolean> = {
        icon: false,
        body: false,
        title: false,
        actions: false,
        "secondary-actions": false,
        footer: false,
    };

    public override willUpdate(changed: PropertyValues<this>) {
        VALID_SLOTS.forEach((slotname) => {
            this.slotted[slotname] = this.hasSlotted(slotname);
        });
        super.willUpdate(changed);
    }

    private renderIcon() {
        if (this.slotted.icon) {
            return html`<div part="icon"><slot name="icon"></slot></div>`;
        }
        if (this.icon) {
            return html`<div part="icon"><ak-icon icon=${this.icon}></ak-icon></div>`;
        }
        if (this.noIcon) {
            return nothing;
        }

        // Render the default icon, depending on the state
        const index = isEmptyStateSize(this.size)
            ? emptyStateSizes.indexOf(this.size)
            : DEFAULT_SIZE_INDEX;
        return this.loading
            ? html`<div part="icon">
                  <ak-spinner size=${spinnerSizes[index] ?? "xl"}></ak-spinner>
              </div>`
            : html`<div part="icon">
                  <ak-icon icon="fa fa-cubes" size="${iconSizes[index] ?? "3x"}"></ak-icon>
              </div>`;
    }

    private renderBody() {
        if (this.slotted.body) {
            return html`<div part="body"><slot name="body"></slot></div>`;
        }
        if (this.loading && !this.noLoadingMessage) {
            return html`<div part="body">${msg("Loading...")}</div>`;
        }
        return nothing;
    }

    public override render() {
        const showFooter =
            this.slotted.footer || this.slotted.actions || this.slotted["secondary-actions"];

        return html`
            <div part="empty-state">
                <div part="content">
                    ${this.renderIcon()}
                    ${this.slotted.title
                        ? html`<div part="title">
                              <slot name="title"></slot>
                          </div>`
                        : nothing}
                    ${this.renderBody()}
                    ${showFooter
                        ? html` <div part="footer">
                              ${this.slotted.actions
                                  ? html`<div part="actions">
                                        <slot name="actions"></slot>
                                    </div>`
                                  : nothing}
                              ${this.slotted["secondary-actions"]
                                  ? html`<div part="actions">
                                        <slot name="secondary-actions"></slot>
                                    </div>`
                                  : nothing}
                              ${this.slotted.footer
                                  ? html`<div part="footer"><slot name="footer"></slot></div>`
                                  : nothing}
                          </div>`
                        : nothing}
                </div>
            </div>
        `;
    }

    // TODO: Double-check this. "No ARIA is better than bad ARIA," and I'm not 100% on my ARIA
    // skills yet.
    public override updated() {
        if (this.loading) {
            this.removeAttribute("aria-label");
            this.setAttribute("aria-live", "polite");
            this.setAttribute("role", "status");
        } else {
            this.removeAttribute("aria-live");
            this.setAttribute("role", "img");
            // Consider aria-label for non-loading states
            if (!this.hasSlotted("title")) {
                this.setAttribute("aria-label", msg("Empty state"));
            }
        }
    }
}
