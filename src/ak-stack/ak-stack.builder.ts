import { Stack } from "./ak-stack.component.js";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type AkStackProps = {
    wrap?: boolean;
    gutter?: "xs" | "sm" | "md" | "lg" | "xl";
    align?: "start" | "end" | "center" | "baseline" | "stretch";
};

/**
 * @summary Helper function to create a Stack component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-stack element
 *
 * @see {@link Stack} - The underlying web component
 */
export function akStack(children: TemplateResult | TemplateResult[], props: AkStackProps = {}) {
    const { wrap, gutter, align } = props;
    return html`
        <ak-stack ?wrap=${wrap} gutter=${ifDefined(gutter)} align=${ifDefined(align)}
            >${children}</ak-stack
        >
    `;
}
