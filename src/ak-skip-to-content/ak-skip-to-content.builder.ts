import { SkipToContent } from "./ak-skip-to-content.component.js";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type SkipToContentProps = Partial<Pick<SkipToContent, "label">> & {
    targetElement?: HTMLElement;
};

/**
 * @summary Helper function to create a SkipToContent component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-skip-to-content element
 *
 * @see {@link SkipToContent} - The underlying web component
 */
export function akSkipToContent(options: SkipToContentProps = {}) {
    const { targetElement, label } = options;
    return html` <ak-skip-to-content .targetElement=${targetElement} label=${ifDefined(label)}></ak-skip-to-content> `;
}
