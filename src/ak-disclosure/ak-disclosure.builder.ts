import { Disclosure } from "./ak-disclosure.component.js";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type AkDisclosureProps = Partial<Pick<Disclosure, "open" | "name" | "icon">> & {
    content?: string | TemplateResult;
    label?: string | TemplateResult;
    labelOpen?: string | TemplateResult;
};

/**
 * @summary Helper function to create a Disclosure component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-disclosure element
 *
 * @see {@link Disclosure} - The underlying web component
 *
 * The label and labelOpen entries can be supplied in content, if you include the slot names in the
 * labels themselves. `label-open` is optional; without it, the `label` will be shown under all
 * conditions.
 */
export function akDisclosure(options: AkDisclosureProps = {}) {
    const { name, open, label, labelOpen, icon, content } = options;

    return html`
        <ak-disclosure ?open=${open} name=${ifDefined(name)} icon=${ifDefined(icon)}>
            ${label ? html`<div slot="label">${label}</div>` : ""}
            ${labelOpen ? html`<div slot="label-open">${labelOpen}</div>` : ""} ${content}
        </ak-disclosure>
    `;
}
