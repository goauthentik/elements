import { ContentHeader } from "./ak-content-header.component.js";
import { msg } from "@lit/localize";
import { html, nothing, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type ContentHeaderProps = Partial<Pick<ContentHeader, "icon">> & {
    breadcrumbs?: TemplateResult;
    iconSlot?: TemplateResult;
    title: string | TemplateResult;
    subtitle?: string | TemplateResult;
};

/**
 * @summary Helper function to create a ContentHeader component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-content-header element
 *
 * @see {@link ContentHeader} - The underlying web component
 */
export function akContentHeader(options: ContentHeaderProps = { title: msg("No title provided") }) {
    const { icon, breadcrumbs, iconSlot, title, subtitle } = options;
    return html`<ak-content-header icon=${ifDefined(icon)}>
        ${breadcrumbs ? html`<span slot="breadcrumbs">${breadcrumbs}</span>` : nothing}
        ${iconSlot ? html`<span slot="icon">${iconSlot}</span>` : nothing}
        ${title ? html`<span slot="title">${title}</span>` : nothing}
        ${subtitle ? html`<span slot="subtitle">${subtitle}</span>` : nothing}</ak-content-header
    >`;
}
