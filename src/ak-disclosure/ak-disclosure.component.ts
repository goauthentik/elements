import { MutationController } from "@lit-labs/observers/mutation-controller.js";
import { PropertyValues, TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";

import { styles as icons } from "../css/base/fa-icons.css";
import { styles } from "./ak-disclosure.css";

import { AkLitElement } from "../component-base.js";

export interface IDisclosure {
    name?: string;
    open?: boolean;
    icon?: TemplateResult;
}

const DEFAULT_ICON = html`<i class="fas fa-angle-right" aria-hidden="true"></i>`;

/**
 * @element ak-disclosure
 *
 * @summary A disclosure is a section of text with a summary and a details section.
 *
 * @description An implementation of Patternfly's "expandable section," only with the sort of smarts
 * found in HTML's <details>/<summary> pair: you can create named groups, setting them all to have
 * the same `name` attribute; in that case, opening one closes any siblings from that named group if
 * it's open, preserving screen space. Siblings must be in the same DOM context; it does not cross
 * shadow DOMs to look for siblings.
 *
 * @attr {string} name - The name of the disclosure group, if you want sibling behavior
 * @attr {boolean} open - Whether the disclosure is expanded
 * @attr {boolean} no-highlight - Removes the prominent border highlight styling
 * @attr {boolean} indent - Indents the content area to align with the label text
 *
 * @slot - Default content shown when the disclosure is expanded
 * @slot label - Label/summary content (auto-assigned if single `<label>` in light DOM)
 * @slot label-open - Alternative label content shown when disclosure is open
 *
 * @csspart disclosure - The main container element
 * @csspart toggle - The clickable toggle button
 * @csspart icon - The expand/collapse icon container
 * @csspart label - The label text container
 * @csspart content - The collapsible content container
 *
 * Toggle Button Properties:
 * @cssprop --pf-v5-c-expandable-section__toggle--Color - Default toggle button text color
 * @cssprop --pf-v5-c-expandable-section__toggle--hover--Color - Toggle button text color on hover
 * @cssprop --pf-v5-c-expandable-section__toggle--active--Color - Toggle button text color when active
 * @cssprop --pf-v5-c-expandable-section__toggle--focus--Color - Toggle button text color when focused
 * @cssprop --pf-v5-c-expandable-section__toggle--m-expanded--Color - Toggle button text color when expanded
 * @cssprop --pf-v5-c-expandable-section__toggle--BackgroundColor - Toggle button background color
 *
 * Toggle Button Spacing:
 * @cssprop --pf-v5-c-expandable-section__toggle--PaddingTop - Top padding of the toggle button
 * @cssprop --pf-v5-c-expandable-section__toggle--PaddingRight - Right padding of the toggle button
 * @cssprop --pf-v5-c-expandable-section__toggle--PaddingBottom - Bottom padding of the toggle button
 * @cssprop --pf-v5-c-expandable-section__toggle--PaddingLeft - Left padding of the toggle button
 * @cssprop --pf-v5-c-expandable-section__toggle--MarginTop - Top margin of the toggle button
 * @cssprop --pf-v5-c-expandable-section__toggle-text--MarginLeft - Left margin of the toggle text
 *
 * Icon Properties:
 * @cssprop --pf-v5-c-expandable-section__toggle-icon--Color - Color of the toggle icon
 * @cssprop --pf-v5-c-expandable-section__toggle-icon--MinWidth - Minimum width of the toggle icon
 * @cssprop --pf-v5-c-expandable-section__toggle-icon--Transition - Transition animation for icon rotation
 * @cssprop --pf-v5-c-expandable-section__toggle-icon--Rotate - Default rotation angle of the icon
 * @cssprop --pf-v5-c-expandable-section__toggle-icon--m-expand-top--Rotate - Icon rotation for expand-top variant
 * @cssprop --pf-v5-c-expandable-section--m-expanded__toggle-icon--Rotate - Icon rotation when expanded
 * @cssprop --pf-v5-c-expandable-section--m-expanded__toggle-icon--m-expand-top--Rotate - Icon rotation when expanded (expand-top variant)
 *
 * Content Area Properties:
 * @cssprop --pf-v5-c-expandable-section__content--MarginTop - Top margin of the content area
 * @cssprop --pf-v5-c-expandable-section__content--MaxWidth - Maximum width of the content area
 * @cssprop --pf-v5-c-expandable-section__content--PaddingBottom - Bottom padding of the content area
 * @cssprop --pf-v5-c-expandable-section__content--PaddingLeft - Left padding of the content area
 * @cssprop --pf-v5-c-expandable-section__content--PaddingRight - Right padding of the content area
 *
 * Display Variant Properties (Large Highlight):
 * @cssprop --pf-v5-c-expandable-section--m-display-lg--BoxShadow - Box shadow for large display variant
 * @cssprop --pf-v5-c-expandable-section--m-display-lg__toggle--PaddingTop - Toggle top padding (large variant)
 * @cssprop --pf-v5-c-expandable-section--m-display-lg__toggle--PaddingRight - Toggle right padding (large variant)
 * @cssprop --pf-v5-c-expandable-section--m-display-lg__toggle--PaddingBottom - Toggle bottom padding (large variant)
 * @cssprop --pf-v5-c-expandable-section--m-display-lg__toggle--PaddingLeft - Toggle left padding (large variant)
 * @cssprop --pf-v5-c-expandable-section--m-display-lg__content--MarginTop - Content top margin (large variant)
 * @cssprop --pf-v5-c-expandable-section--m-display-lg__content--PaddingRight - Content right padding (large variant)
 * @cssprop --pf-v5-c-expandable-section--m-display-lg__content--PaddingBottom - Content bottom padding (large variant)
 * @cssprop --pf-v5-c-expandable-section--m-display-lg__content--PaddingLeft - Content left padding (large variant)
 *
 * Highlight Border Properties:
 * @cssprop --pf-v5-c-expandable-section--m-display-lg--after--BackgroundColor - Default highlight border color
 * @cssprop --pf-v5-c-expandable-section--m-display-lg--after--Width - Width of the highlight border
 * @cssprop --pf-v5-c-expandable-section--m-display-lg--m-expanded--after--BackgroundColor - Highlight border color when expanded
 *
 * Content Layout Modifiers:
 * @cssprop --pf-v5-c-expandable-section--m-limit-width__content--MaxWidth - Maximum width for limit-width variant
 * @cssprop --pf-v5-c-expandable-section--m-indented__content--PaddingLeft - Left padding for indented content
 * @cssprop --pf-v5-c-expandable-section--m-truncate__content--LineClamp - Line clamp for truncated content
 * @cssprop --pf-v5-c-expandable-section--m-truncate__toggle--MarginTop - Top margin for truncate variant toggle
 */
export class Disclosure extends AkLitElement implements IDisclosure {
    static readonly styles = [styles, icons];

    @property({ type: String })
    public name?: string;

    @property({ type: Boolean, reflect: true })
    public open = false;

    @property({ type: Object })
    public icon = DEFAULT_ICON;

    public override connectedCallback() {
        super.connectedCallback();
    }

    private setAutoSlot() {
        const labels = [...this.querySelectorAll(":scope > label")];
        if (labels.length === 1 && !labels[0].hasAttribute("slot")) {
            labels[0].slot = "label";
            this.requestUpdate();
        }
    }

    private updateAutoSlot = () => {
        // No need for an autoslot if one's named.
        if (this.querySelectorAll('[slot="label"]').length > 0) {
            return;
        }
        this.setAutoSlot();
    };

    protected observer = new MutationController(this, {
        config: {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["slot"],
        },
        callback: this.updateAutoSlot,
    });

    #closeSiblings() {
        if (!(this.name && this.open && this.parentNode)) {
            return;
        }
        const parent = this.getRootNode() as ParentNode;
        if (
            !(parent === document || parent instanceof HTMLElement || parent instanceof ShadowRoot)
        ) {
            return;
        }

        const siblings = [
            ...parent.querySelectorAll(`ak-disclosure[name="${this.name}"]`),
        ] as Disclosure[];

        siblings.forEach((disclosure: Disclosure) => {
            if (disclosure !== this && disclosure.open) {
                disclosure.open = false;
            }
        });
    }

    protected renderLabel() {
        return this.hasSlotted("label-open") && this.open
            ? html`<slot name="label-open"></slot>`
            : html`<slot name="label"></slot>`;
    }

    private onToggle = () => {
        this.open = !this.open;
        this.dispatchEvent(
            new Event("toggle", {
                bubbles: true,
                composed: true,
            })
        );
    };

    public override willUpdate() {
        this.updateAutoSlot();
    }

    public override render() {
        return html` <div part="disclosure" id="main">
            <button
                type="button"
                part="toggle"
                id="toggle"
                aria-controls="content"
                aria-expanded=${this.open ? "true" : "false"}
                @click=${this.onToggle}
            >
                <span id="icon" part="icon"> ${this.icon} </span>
                <span id="toggle-text" part="label">${this.renderLabel()}</span>
            </button>
            <div id="content" part="content" aria-labelledby="toggle" ?hidden=${!this.open}>
                <slot></slot>
            </div>
        </div>`;
    }

    updated(changed: PropertyValues<this>) {
        if (changed.has("open") && this.open) {
            this.#closeSiblings();
        }
    }
}
