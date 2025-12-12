import { SkipToContent } from "./ak-skip-to-content.component.js";

import { spread } from "@open-wc/lit-helpers";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type SkipToContentProps = Partial<HTMLElement> &
    Partial<Pick<SkipToContent, "label">> & {
        targetElement?: HTMLElement;
        content?: string | TemplateResult;
    };

/**
 * @summary Helper function to create a SkipToContent component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-skip-to-content element
 *
 * @see {@link SkipToContent} - The underlying web component
 */
export function akSkipToContent(options: SkipToContentProps = {}) {
    const { targetElement, label, content, ...rest } = options;
    return html`
        <ak-skip-to-content
            ${spread(rest)}
            .targetElement=${targetElement}
            label=${ifDefined(label)}
        >
            ${content ? content : ""}
        </ak-skip-to-content>
    `;
}
