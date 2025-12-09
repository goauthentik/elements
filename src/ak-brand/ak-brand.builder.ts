import { Brand } from "./ak-brand.component.js";

import { spread } from "@open-wc/lit-helpers";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type BrandProps = Partial<HTMLElement> & Partial<Pick<Brand, "src" | "alt">>;

/**
 * @summary Helper function to create a Brand component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-brand element
 *
 * @see {@link Brand} - The underlying web component
 */
export function akBrand(options: BrandProps = {}) {
    const { src, alt, ...rest } = options;
    return html`
        <ak-brand ${spread(rest)} src=${ifDefined(src)} alt=${ifDefined(alt)}></ak-brand>
    `;
}
