import { Title } from "./ak-title.component.js";

import { html, nothing, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export const titleSize = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const;
export type TitleSize = (typeof titleSize)[number];

export type AkTitleProps = Partial<Pick<Title, "href" | "noAutoSlot">> & {
    icon?: string | TemplateResult;
    size?: TitleSize;
    content?: string | TemplateResult;
};

/**
 * @summary Helper function to create a Title component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-title element
 *
 * @see {@link Title} - The underlying web component
 */
export function akTitle(options: AkTitleProps = {}): TemplateResult {
    const { content, size, href, noAutoSlot, icon } = options;

    return html`
        <ak-title size=${ifDefined(size)} href=${ifDefined(href)} ?no-auto-slot=${!!noAutoSlot}>
            ${icon ? html`<div slot="icon">${icon}</div>` : ""} ${content ?? nothing}
        </ak-title>
    `;
}
