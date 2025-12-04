import { Tooltip, type Trigger } from "./ak-tooltip.component.js";

import { spread } from "@open-wc/lit-helpers";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type TooltipProps = Partial<Pick<Tooltip, "htmlFor" | "placement">> & {
    content: string | TemplateResult;
    trigger: Trigger;
    noArrow?: boolean;
};

/**
 * @summary Helper function to create a Tooltip component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-tooltip element
 *
 * @see {@link Tooltip} - The underlying web component
 */
export function akTooltip(options: TooltipProps) {
    const { content, htmlFor, trigger, placement, noArrow, ...rest } = options;
    console.log(rest);

    return html`
        <ak-tooltip
            ${spread(rest)}
            for=${ifDefined(htmlFor)}
            trigger=${ifDefined(trigger)}
            placement=${ifDefined(placement)}
            ?no-arrow=${!!noArrow}
            >${content}</ak-tooltip
        >
    `;
}
