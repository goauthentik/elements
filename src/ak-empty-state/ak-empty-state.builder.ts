import "./ak-empty-state.component.js";

import { EmptyState } from "./ak-empty-state.component.js";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

/* The `pick`ed fields here correspond to their types in the EmptyState class above. */

export interface AkEmptyStateProps
    extends Partial<Pick<EmptyState, "size" | "loading" | "noIcon" | "noDefaultLabel">> {
    fullHeight?: boolean;
    icon?: string | TemplateResult;
    title?: string | TemplateResult;
    body?: string | TemplateResult;
    footer?: string | TemplateResult;
    actions?: string | TemplateResult;
    secondaryActions?: string | TemplateResult;
}

/**
 * @summary Helper function to create an EmptyState component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-empty-state element
 *
 * @see {@link EmptyState} - The underlying web component
 */
export function akEmptyState(options: AkEmptyStateProps) {
    const {
        size,
        fullHeight,
        noDefaultLabel,
        noIcon,
        loading,
        icon,
        title,
        body,
        footer,
        actions,
        secondaryActions,
    } = options;
    return html`
        <style>
            [slot="actions"] {
                display: flex;
                gap: 0.25rem;
            }
        </style>
        <ak-empty-state
            ?loading=${loading}
            ?full-height=${fullHeight}
            ?no-icon=${noIcon}
            ?no-label=${noDefaultLabel}
            size=${ifDefined(String(size))}
        >
            ${icon ? html`<div slot="icon">${icon}</div>` : ""}
            ${title ? html`<div slot="title">${title}</div>` : ""}
            ${body ? html`<div slot="body">${body}</div>` : ""}
            ${footer ? html`<div slot="footer">${footer}</div>` : ""}
            ${actions ? html`<div slot="actions">${actions}</div>` : ""}
            ${secondaryActions ? html`<div slot="secondary-actions">${secondaryActions}</div>` : ""}
        </ak-empty-state>
    `;
}
