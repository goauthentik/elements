import { Split } from "./ak-split.component.js";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type AkSplitProps = {
    wrap?: boolean;
    gutter?: "xs" | "sm" | "md" | "lg" | "xl";
    align?: "start" | "end" | "center" | "baseline" | "stretch";
};

/**
 * @summary Helper function to create a Split component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-split element
 *
 * @see {@link Split} - The underlying web component
 */
export function akSplit(children: TemplateResult | TemplateResult[], props: AkSplitProps = {}) {
    const { wrap, gutter, align } = props;
    return html`
        <ak-split ?wrap=${wrap} gutter=${ifDefined(gutter)} align=${ifDefined(align)}
            >${children}</ak-split
        >
    `;
}
