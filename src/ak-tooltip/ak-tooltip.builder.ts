import { Tooltip, type Trigger } from "./ak-tooltip.component.js";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type TooltipProps = Partial<Pick<Tooltip, "htmlFor" | "placement">> & {
    content: string | TemplateResult;
    trigger: Trigger;
    offset?: number;
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
    const { content, htmlFor, trigger, placement, offset, noArrow } = options;

    return html`
        <ak-tooltip
            for=${ifDefined(htmlFor)}
            trigger=${ifDefined(trigger)}
            placement=${ifDefined(placement)}
            offset=${ifDefined(offset)}
            ?no-arrow=${!!noArrow}
            >${content}</ak-tooltip
        >
    `;
}
