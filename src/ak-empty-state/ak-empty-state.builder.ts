import "./ak-empty-state.component.js";

import { EmptyState } from "./ak-empty-state.component.js";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

/* The `pick`ed fields here correspond to their types in the EmptyState class above. */

export interface EmptyStateProps extends Partial<
    Pick<EmptyState, "size" | "loading" | "textOnly" | "spinnerOnly">
> {
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
export function akEmptyState(options: EmptyStateProps) {
    const {
        size,
        fullHeight,
        spinnerOnly,
        textOnly,
        loading,
        icon,
        title,
        body,
        footer,
        actions,
        secondaryActions,
    } = options;
    return html`
        <ak-empty-state
            ?loading=${loading}
            ?full-height=${fullHeight}
            ?text-only=${textOnly}
            ?spinner-only=${spinnerOnly}
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
