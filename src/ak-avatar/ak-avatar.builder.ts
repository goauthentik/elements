import { Avatar } from "./ak-avatar.component.js";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type AvatarProps = Partial<Pick<Avatar, "src" | "alt" | "icon" | "initials">>;

/**
 * @summary Helper function to create a Avatar component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-avatar element
 *
 * @see {@link Avatar} - The underlying web component
 */
export function akAvatar(options: AvatarProps = {}) {
    const { src, alt, icon, initials } = options;
    return html`
        <ak-avatar
            src=${ifDefined(src)}
            alt=${ifDefined(alt)}
            icon=${ifDefined(icon)}
            initials=${ifDefined(initials)}
        ></ak-avatar>
    `;
}
