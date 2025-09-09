import "./ak-badge.js";

import { type Badge } from "./ak-badge.js";

import { html, type TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type BadgeProps = Partial<Pick<Badge, "screenReaderText">> & {
    content: TemplateResult | string;
    read?: boolean;
    unread?: boolean;
};

/**
 * @summary Helper function to create a Badge component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-badge element
 *
 * @see {@link Badge} - The underlying web component
 */
export function akBadge(options: BadgeProps = { content: "" }) {
    const { content, screenReaderText, read, unread } = options;
    return html`<ak-badge
        ?read=${read}
        ?unread=${unread}
        screen-reader-text=${ifDefined(screenReaderText)}
        >${content}</ak-badge
    >`;
}
