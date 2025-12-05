import { parseLength } from "../utils/parseSize.js";
import { TooltipInitialState, type TooltipState } from "./ak-tooltip-state-machine.js";
import styles from "./ak-tooltip.css";

import type { Middleware, Placement } from "@floating-ui/dom";
import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";

import { html, LitElement, nothing, PropertyValues } from "lit";
import { property, query, state } from "lit/decorators.js";
import { createRef, ref, Ref } from "lit/directives/ref.js";

export type Trigger = "hover" | "focus";

const DEFAULT_SHOW_DELAY = "100ms";
const DEFAULT_HIDE_DELAY = "150ms";

const validHtmlId = /^[A-Za-z][.\w\-:]*$/;
const delaySyntax = /^(\d+)\s*(ms|s)$/;

function parseDelay(delay: string) {
    const g = delaySyntax.exec(delay.trim());
    if (!(g && g.length > 2)) {
        return 0;
    }
    return parseInt(g[1], 10) * (g[2] === "ms" ? 1 : 1000);
}

const oppositeSideMap: Record<string, string> = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom",
};

/**
 * @class Tooltip
 * @element ak-tooltip
 *
 * @summary A **tooltip** is a an element that appears on hover to provide additional information
 *
 * @description
 * A tooltip displays additional information when users hover over or focus on an anchor element
 * in order to provide context or to provide a textual label for icons and pictograms.
 *
 * ## Attributes
 *
 * - @attr {string} for - ID or CSS selector of the anchor element. Must be in the same context as
 *   the tooltip
 * - @attr {HTMLElement} target - Direct reference to the anchor element. Takes precedence over
 *   "for" attribute. The anchor must be in same or a sibling context of the tooltip.
 * - @attr {"hover"|"focus"} trigger - Event type that triggers tooltip display (default: "hover")
 *   - "hover": Shows on mouseenter/mouseleave events
 *   - "focus": Shows on focus/blur events
 * - @attr {Placement} placement - Positioning relative to anchor: "top", "top-start", "top-end",
 *   "right", "right-start", "right-end", "bottom", "bottom-start", "bottom-end", "left",
 *   "left-start", "left-end" (default: "top")
 * - @attr {boolean} no-arrow - Don't show the arrow
 *
 * ### Deprecated attributes (try not to use these):
 *
 * - @attr {string} content - Text content of the tooltip. DEPRECATED: prefer using the slot
 *
 * ## Slots
 *
 * @slot - Slot for tooltip content. Anonymous, no `slot` attribute required. Prefer using this
 * over the `content` attribute.
 *
 * ## Component elements that can be customized via the `::part()` pseudo-selector
 *
 * @csspart tooltip - The dialog element containing the tooltip
 * @csspart arrow - The arrow element pointing toward the anchor
 * @csspart content - The content wrapper element inside the tooltip
 *
 * ## Tooltip content and border properties
 *
 * - @cssprop --pf-v5-c-tooltip--MaxWidth
 * - @cssprop --pf-v5-c-tooltip--BoxShadow
 * - @cssprop --pf-v5-c-tooltip__content--PaddingTop
 * - @cssprop --pf-v5-c-tooltip__content--PaddingRight
 * - @cssprop --pf-v5-c-tooltip__content--PaddingBottom
 * - @cssprop --pf-v5-c-tooltip__content--PaddingLeft
 * - @cssprop --pf-v5-c-tooltip__content--Color
 * - @cssprop --pf-v5-c-tooltip__content--BackgroundColor
 * - @cssprop --pf-v5-c-tooltip__content--FontSize
 *
 * ## Custom CSS properties that control the animation behavior and distance from the target.
 *
 * - @cssprop --ak-v1-c-tooltip--ShowDelay - Delay before showing tooltip after trigger. Stops the
 *   tooltip from showing up until it's sure you weren't just skating past. Honors
 *   prefers-reduced-motion. (default: 100ms)
 * - @cssprop --ak-v1-c-tooltip--HideDelay - Delay before hiding tooltip after leaving the Tooltip
     or the anchor.
 *   150ms). Allows smooth transition from anchor to tooltip. Overridden to 1s when
 * - @cssprop --ak-v1-c-tooltip--Offset - Distance offset between tooltip and anchor element
 *   (default: 0.75rem)
 *
 * ## Arrow Look and Feel.  Change these carefully.
 *
 * Don't try to disable the arrow from here. If you don't want an arrow, there is a `no-arrow`
 * attribute for that.
 *
 * - @cssprop --pf-v5-c-tooltip__arrow--Width - Width of the arrow element (default: 0.9375rem)
 * - @cssprop --pf-v5-c-tooltip__arrow--Height - Height of the arrow element (default: 0.9375rem)
 * - @cssprop --pf-v5-c-tooltip__arrow--BackgroundColor - Background color of the arrow
 * - @cssprop --pf-v5-c-tooltip__arrow--BoxShadow - Box shadow applied to the arrow
 * - @cssprop --ak-v1-c-tooltip--ArrowSize - Unified size for arrow width and height
 * - @cssprop --ak-v1-c-tooltip--ArrowWidth - Arrow width, overrides --ak-v1-c-tooltip--ArrowSize
 * - @cssprop --ak-v1-c-tooltip--ArrowHeight - Arrow height, overrides --ak-v1-c-tooltip--ArrowSize
 */

export class Tooltip extends LitElement {
    static readonly styles = [styles];

    /**
     * @attr {string} content: What to show in the tooltip
     *
     * DEPRECATED. prefer using slots.
     */
    @property({ type: String })
    content = "";

    /**
     * @attr {boolean} noArrow: Don't show an arrow pointing toward the tooltip.
     */
    @property({ type: Boolean, attribute: "no-arrow" })
    noArrow = false;

    /**
     * @attr {string} for: The id or selector for the target. Must be in the same context as the
     * tooltip.
     */
    @property({ type: String, attribute: "for" })
    htmlFor = "";

    /**
     * @attr {object} target: A reference to the target. Must be in the same or in a sibling context
       of the tooltip.  `.target` takes precedence over `for`
     */
    @property({ type: Object, attribute: "target" })
    target?: HTMLElement;

    /**
     * @attr {string} trigger - What event causes the tooltip to show up.
     */
    @property({ type: String })
    trigger: Trigger = "hover";

    /**
     * @attr { string } placement - Where should we place the tooltip?
     */
    @property({ type: String })
    placement: Placement = "top";

    @state()
    isOpen = false;

    protected state: TooltipState = new TooltipInitialState(this);

    protected dialog: Ref<HTMLDialogElement> = createRef();

    @query('[part="arrow"]')
    private arrow?: HTMLElement;

    public showDelay = parseDelay(DEFAULT_SHOW_DELAY);
    public hideDelay = parseDelay(DEFAULT_HIDE_DELAY);

    protected anchor: HTMLElement | null = null;

    #cleanupFloating?: () => void;
    #anchorAbortController = new AbortController();
    #tooltipAbortController = new AbortController();

    setState(state: TooltipState) {
        this.state = state;
    }

    // To enable the debugging variant, these cannot be made private.
    protected onAnchorEnter = () => {
        this.state.onAnchorEnter();
    };

    protected onAnchorLeave = () => {
        this.state.onAnchorLeave();
    };

    #onTooltipEnter = () => {
        this.state.onTooltipEnter();
    };

    #onTooltipLeave = () => {
        this.state.onTooltipLeave();
    };

    #getAnchor() {
        const parent = this.getRootNode() as ParentNode;
        if (
            !(parent === document || parent instanceof HTMLElement || parent instanceof ShadowRoot)
        ) {
            console.warn("ak-tooltip: component not running in a valid context");
            return null;
        }

        if (!(this.htmlFor || this.target)) {
            console.warn("ak-tooltip: tooltip without anchor declared.");
            return null;
        }

        if (this.target) {
            if (!(this.target instanceof HTMLElement)) {
                console.warn("ak-tooltip: '.target' prop does not resolve to an HTMLElement");
                return null;
            }
            return this.target;
        }

        // Fallback to search based on selector, even if we're pretty sure it's an ID.
        const anchor = validHtmlId.test(this.htmlFor)
            ? parent.querySelector(`#${this.htmlFor}`) || parent.querySelector(this.htmlFor)
            : parent.querySelector(this.htmlFor);

        if (!anchor) {
            console.warn("ak-tooltip: could not find anchor");
            return null;
        }

        if (!(anchor instanceof HTMLElement)) {
            console.warn(
                `ak-tooltip: element '${this.htmlFor}' does not resolve to an HTMLElement`,
            );
            return null;
        }

        return anchor;
    }

    protected attachToAnchor() {
        this.anchor = this.#getAnchor();
        if (!this.anchor) {
            return;
        }

        const signal = { signal: this.#anchorAbortController.signal };
        this.anchor.addEventListener("focus", this.onAnchorEnter, signal);
        this.anchor.addEventListener("blur", this.onAnchorLeave, signal);
        if (this.trigger === "hover") {
            this.anchor.addEventListener("mouseenter", this.onAnchorEnter, signal);
            this.anchor.addEventListener("mouseleave", this.onAnchorLeave, signal);
        }
    }

    #detachFromAnchor() {
        if (this.isOpen) {
            this.#detachDialogListeners();
        }
        if (this.anchor) {
            this.#anchorAbortController.abort();
            this.#anchorAbortController = new AbortController();
        }
        this.state.clearTimeout();
        this.#cleanupFloating?.();
    }

    public override connectedCallback() {
        super.connectedCallback();
        this.attachToAnchor();
    }

    public override disconnectedCallback() {
        super.disconnectedCallback();
        this.#detachFromAnchor();
    }

    public override willUpdate(changed: PropertyValues<this>) {
        super.willUpdate(changed);
        this.hideDelay = parseDelay(
            getComputedStyle(this)?.getPropertyValue("--tooltip--HideDelay") ?? "150ms",
        );
        this.showDelay = parseDelay(
            getComputedStyle(this)?.getPropertyValue("--tooltip--ShowDelay") ?? "100ms",
        );
    }

    public override render() {
        const fromSlot = this.textContent?.trim() || this.childNodes.length > 0;
        const content = fromSlot ? html`<slot></slot>` : this.content;
        return html`<dialog ${ref(this.dialog)} part="tooltip" role="tooltip" aria-live="polite">
            ${this.noArrow ? nothing : html`<div part="arrow"></div>`}
            <div part="content">${content}</div>
        </dialog>`;
    }

    #attachDialogListeners() {
        if (!this.isOpen) {
            throw new Error("Can't happen.");
        }

        const signal = { signal: this.#tooltipAbortController.signal };
        this.dialog.value?.addEventListener("focus", this.#onTooltipEnter, signal);
        this.dialog.value?.addEventListener("blue", this.#onTooltipLeave, signal);
        if (this.trigger === "hover") {
            this.dialog.value?.addEventListener("mouseenter", this.#onTooltipEnter, signal);
            this.dialog.value?.addEventListener("mouseleave", this.#onTooltipLeave, signal);
        }
    }

    #detachDialogListeners() {
        this.#tooltipAbortController.abort();
        this.#tooltipAbortController = new AbortController();
    }

    #updatePosition = async () => {
        const offsetDistance = parseLength(
            getComputedStyle(this).getPropertyValue("--tooltip--Offset"),
        );

        const [anchor, dialog] = [this.anchor, this.dialog.value];
        if (!(anchor && dialog)) {
            return;
        }

        const middleware: Middleware[] = [offset(offsetDistance), flip(), shift()];

        const { x, y, placement, middlewareData } = await computePosition(anchor, dialog, {
            placement: this.placement,
            middleware,
        });

        Object.assign(dialog.style, {
            left: `${x}px`,
            top: `${y}px`,
        });

        if (this.arrow && !this.noArrow) {
            this.arrow.classList.remove(...this.arrow.classList);
            this.arrow.classList.add(`m-${placement}`);
        }
    };

    #setPositioning() {
        const [anchor, dialog] = [this.anchor, this.dialog.value];
        if (!(anchor && dialog)) {
            return;
        }

        this.#cleanupFloating = autoUpdate(anchor, dialog, this.#updatePosition, {
            ancestorScroll: true,
            ancestorResize: true,
            elementResize: true,
            layoutShift: true,
        });
    }

    #showTooltip() {
        const dialog = this.dialog.value;
        if (!dialog) {
            return;
        }
        dialog.inert = true;
        dialog.show();
        dialog.inert = false;
    }

    #hideTooltip() {
        const dialog = this.dialog.value;
        if (!dialog) {
            return;
        }
        dialog.close();
    }

    public override updated(changed: PropertyValues<this>) {
        if (changed.has("htmlFor")) {
            this.#detachFromAnchor();
            this.attachToAnchor();
        }

        if (changed.has("isOpen")) {
            if (this.isOpen) {
                this.#attachDialogListeners();
                this.#setPositioning();
                this.#showTooltip();
            } else {
                this.#detachDialogListeners();
                this.#hideTooltip();
            }
        }
    }
}
