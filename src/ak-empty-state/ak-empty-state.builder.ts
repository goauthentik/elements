import "./ak-empty-state.component.js";

import { EmptyState } from "./ak-empty-state.component.js";

import { match, P } from "ts-pattern";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

/* The `pick`ed fields here correspond to their types in the EmptyState class above. */

export interface EmptyStateSlots {
    icon?: string | TemplateResult;
    title?: string | TemplateResult;
    body?: string | TemplateResult;
    footer?: string | TemplateResult;
    actions?: string | TemplateResult;
    secondaryActions?: string | TemplateResult;
}

export type EmptyStateProps = Partial<
    Pick<EmptyState, "size" | "loading" | "textOnly" | "spinnerOnly">
> &
    EmptyStateSlots & { fullHeight?: boolean };

const SLOTNAMES: (keyof EmptyStateSlots)[] = [
    "icon",
    "title",
    "body",
    "footer",
    "actions",
    "secondaryActions",
] as const;

type SlotName = (typeof SLOTNAMES)[number];

type SlotContent = string | TemplateResult | undefined;

/**
 * @summary Helper function to create an EmptyState component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-empty-state element
 *
 * NOTE: This function does not edit TemplateResults passed in. If you pass in a TemplateResult, it
 * *must* indicated what slot it's being added to, even if you think the prop should handle it.
 *
 * @see {@link EmptyState} - The underlying web component
 */
export function akEmptyState(options: EmptyStateProps) {
    const slots = SLOTNAMES.filter((s) => !!options[s]);

    const slotRenderer = (s: string, c: string | TemplateResult) => html`<div slot=${s}>${c}</div>`;

    const slotHandler = (s: SlotName) =>
        match<[SlotContent, SlotName], SlotContent>([options[s], s])
            .with([P.string, "secondaryActions"], ([c]) => slotRenderer("secondary-actions", c))
            .with([P.string, "title"], ([c]) => html`<h2 slot="title">${c}</h2>`)
            .with([P.string, "body"], ([c]) => html`<p slot="body">${c}</p>`)
            .with(
                [P.string, "icon"],
                ([option]) => html`<ak-icon slot="icon" icon=${option}></ak-icon>`,
            )
            .with([P.string, P._], ([option, s]) => slotRenderer(s, option))
            .otherwise(() => options[s]);

    let opts = {
        ...options,
        ...Object.fromEntries(slots.map((s) => [s, slotHandler(s)])),
    };

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
