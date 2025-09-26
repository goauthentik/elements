import "../ak-icon/ak-icon.js";
import "../ak-spinner/ak-spinner.js";

import styles from "./ak-empty-state.css";

import { msg } from "@lit/localize";
import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import { DynamicSlotController } from "../controllers/dynamic-slot-controller.js";
import { template, type EmptyStateSize } from "./ak-empty-state.template.js";
/**
 * Size variants for the Empty State component
 */

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

export class EmptyState extends LitElement implements IEmptyState {
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
    public size: EmptyStateSize = "lg";

    #onSlotChange = () => {
        this.requestUpdate();
    };

    #slotsController = new DynamicSlotController(this, this.#onSlotChange);

    public override render() {
        const [hasTitle, hasBody, hasActions, hasSecondaryActions, hasFooterContent] = [
            "title",
            "body",
            "actions",
            "secondary-actions",
            "footer",
        ].map((name) => this.#slotsController.has(name));

        const hasFooter = hasActions || hasSecondaryActions || hasFooterContent;
        const { icon, noIcon, size, loading, noLoadingMessage } = this;

        return template({
            hasTitle,
            hasBody,
            hasFooter,
            hasActions,
            hasSecondaryActions,
            hasFooterContent,
            useIconSlot: this.#slotsController.has("icon"),
            icon,
            noIcon,
            size,
            loading,
            showLoading: loading && !noLoadingMessage,
        });
    }

    // Double-check this. "No ARIA is better than bad ARIA," and I'm not 100% on my ARIA skills yet.
    public override updated() {
        if (this.loading) {
            this.removeAttribute("aria-label");
            this.setAttribute("aria-live", "polite");
            this.setAttribute("role", "status");
        } else {
            this.removeAttribute("aria-live");
            this.setAttribute("role", "img");
            // Consider aria-label for non-loading states
            if (!this.#slotsController.has("title")) {
                this.setAttribute("aria-label", msg("Empty state"));
            }
        }
    }
}
