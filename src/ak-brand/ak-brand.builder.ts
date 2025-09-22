import { Brand } from "./ak-brand.component.js";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type AkBrandProps = Partial<Pick<Brand, "src" | "alt">>;

/**
 * @summary Helper function to create a Brand component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-brand element
 *
 * @see {@link Brand} - The underlying web component
 */
export function akBrand(options: AkBrandProps = {}) {
    const { src, alt } = options;
    return html` <ak-brand src=${ifDefined(src)} alt=${ifDefined(alt)}></ak-brand> `;
}
