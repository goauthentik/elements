import "../ak-tooltip/ak-tooltip.js";
import "../ak-icon/ak-icon.js";

import styles from "./ak-avatar.css";
import { styles as mediaStyles } from "./ak-avatar.media.css";

import { html, LitElement, PropertyValues, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

export interface IAvatar {
    src?: string;
    alt?: string;
    border?: "light" | "dark";
    size?: "sm" | "md" | "lg" | "xl";
}

const DEFAULT_ICON = "fa fa-user";

/**
 * @summary ak-avatar
 *
 * @summary An **avatar** is an image used to identify an individual using the application
 *
 * These attributes, "size" and "border", only influence the look of the component, and are defined
 * only in the CSS.
 *
 * @attr {string} border - "dark" | "light"; the default is no border
 *
 */
export class Avatar extends LitElement implements IAvatar {
    static readonly styles = [styles, mediaStyles];

    /** @attr {string} src - The URL for an avatar image.  Highest priority. */
    @property()
    public src?: string;

    /** @attr {string} icon - The (ak-icon, so mostly fontawesome or patternfly) name for an avatar
        icon. Second highest priority */
    @property()
    public icon?: string;

    /** @attr {string} initials - A two-or-three letter text for the avatar.  Third priority */
    @property()
    public initials: string = "";

    /** @attr {string} initials - A full textual name to use as a tooltip and/or `<img alt>` */
    @property()
    public alt: string = "";

    // Although this almost always has relevance only to CSS, in the case of icon (and the fallback
    // icon), this has to be passed to ak-icon.
    /** @attr {string} size - "sm", "md", "lg", "xl"; "md" is also the default behavior */
    @property()
    public size?: IAvatar["size"];

    @state()
    private imageLoadFailed = false;

    #onImageFail = () => {
        this.imageLoadFailed = true;
    };

    // In the unlikely event that the `src` attribute changes on an existing avatar...
    protected override updated(changed: PropertyValues<this>) {
        if (changed.has("src")) {
            this.imageLoadFailed = false;
        }
    }

    #maybeWithTooltip(content: TemplateResult) {
        return this.alt
            ? html`${content} <ak-tooltip .target=${this}>${this.alt}</ak-tooltip>`
            : content;
    }

    #renderAvatar(src: string) {
        return this.#maybeWithTooltip(
            html`<img part="avatar" src=${src} @error=${this.#onImageFail} />`,
        );
    }

    #renderIcon(icon: string) {
        return this.#maybeWithTooltip(
            html`<ak-icon part="avatar-icon" icon=${icon} size=${ifDefined(this.size)}></ak-icon>`,
        );
    }

    #renderInitials(initials: string) {
        return this.#maybeWithTooltip(
            html`<div part="avatar-initials">${this.initials.trim().substr(0, 3)}</div>`,
        );
    }

    public override render() {
        const { src, initials, icon, imageLoadFailed } = this;

        /* Priority order: Image first */
        if (src && !imageLoadFailed) {
            return this.#renderAvatar(src);
        }

        if (icon) {
            return this.#renderIcon(icon);
        }

        if (initials && initials.trim().length > 0) {
            return this.#renderInitials(initials);
        }

        return this.#renderIcon("fa fa-user");
    }
}
