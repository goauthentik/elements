import { Button, ButtonSeverity, ButtonSize } from "./ak-button.component.js";

import { html, nothing, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

/**
 * Configuration options for the akButton helper function
 */
export type AkButtonProps = Partial<
    Pick<Button, "type" | "variant" | "label" | "value" | "href" | "target" | "name">
> & {
    content?: string | TemplateResult | typeof nothing;
    disabled?: boolean;
    severity?: ButtonSeverity;
    size?: ButtonSize;
    theme?: "light" | "dark";
    block?: boolean;
    inline?: boolean;
    active?: boolean;
    expanded?: boolean;
};

/**
 * @summary Helper function to create a Button component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-button element
 *
 * @see {@link Button} - The underlying web component
 */
export function akButton(options: AkButtonProps = {}): TemplateResult {
    const {
        type,
        variant,
        severity,
        size,
        label,
        theme,
        value,
        href,
        target,
        name,
        disabled,
        block,
        inline,
        active,
        expanded,
        content = nothing,
    } = options;

    return html`
        <ak-button
            type=${ifDefined(type)}
            variant=${ifDefined(variant)}
            severity=${ifDefined(severity)}
            size=${ifDefined(size)}
            label=${ifDefined(label)}
            theme=${ifDefined(theme)}
            value=${ifDefined(value)}
            href=${ifDefined(href)}
            target=${ifDefined(target)}
            name=${ifDefined(name)}
            ?disabled=${!!disabled}
            ?block=${!!block}
            ?inline=${!!inline}
            ?active=${!!active}
            ?expanded=${!!expanded}
        >
            ${content || nothing}
        </ak-button>
    `;
}
