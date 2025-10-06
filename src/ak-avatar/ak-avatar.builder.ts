import { Avatar } from "./ak-avatar.component.js";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type AkAvatarProps = Partial<Pick<Avatar, "src" | "alt">>;

/**
 * @summary Helper function to create a Avatar component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-avatar element
 *
 * @see {@link Avatar} - The underlying web component
 */
export function akAvatar(options: AkAvatarProps = {}) {
    const { src, alt } = options;
    return html` <ak-avatar src=${ifDefined(src)} alt=${ifDefined(alt)}></ak-avatar> `;
}
