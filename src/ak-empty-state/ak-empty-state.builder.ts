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

const SLOTNAMES: (keyof EmptyStateProps)[] = [
    "icon",
    "title",
    "body",
    "footer",
    "actions",
    "secondaryActions",
];

/**
 * @summary Helper function to create an EmptyState component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-empty-state element
 *
 * @see {@link EmptyState} - The underlying web component
 */
export function akEmptyState(options: EmptyStateProps) {
    const slots = SLOTNAMES.filter((s) => !!options[s]);

    let opts = {
        ...options,
        ...Object.fromEntries(
            slots.map((s) => [
                s,
                typeof options[s] === "string"
                    ? html`<div slot=${s === "secondaryActions" ? "secondary-actions" : s}>
                          ${options[s]}
                      </div>`
                    : options[s],
            ]),
        ),
    };
    console.log(opts);

    const { size, fullHeight, spinnerOnly, textOnly, loading } = opts;

    return html`
        <ak-empty-state
            ?loading=${loading}
            ?full-height=${fullHeight}
            ?text-only=${textOnly}
            ?spinner-only=${spinnerOnly}
            size=${ifDefined(String(size))}
        >
            ${slots.map((s) => opts[s])}
        </ak-empty-state>
    `;
}
