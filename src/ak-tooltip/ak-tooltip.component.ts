import { computePosition, flip, shift, offset, arrow, autoUpdate } from "@floating-ui/dom";
import type { Placement, Middleware } from "@floating-ui/dom";
import styles from "./ak-tooltip.css";

import { LitElement, PropertyValues, html, nothing } from "lit";
import { query, property, state } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";

const validHtmlId = /^[A-Za-z][.\w\-:]*$/;

const oppositeSideMap: Record<string, string> = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom",
};

export type Trigger = "hover" | "focus";
type Timeout = ReturnType<typeof setTimeout> | null;

abstract class TooltipEvents {
    type: string = "";
    timer: Timeout = null;
    host: Tooltip;

    constructor(host: Tooltip) {
        this.host = host;
    }

    onTooltipEnter = () => {
        /* no op */
    };

    onTooltipLeave = () => {
        /* no op */
    };

    onAnchorEnter = () => {
        /* no op */
    };

    onAnchorLeave = () => {
        /* no op */
    };

    setState<T extends TooltipState>(State: TooltipStateConstructor<T>) {
        this.host.setState(new State(this.host));
    }

    clearTimeout() {
        if (this.timer !== null) {
            clearTimeout(this.timer);
        }
    }
}

type TooltipStateConstructor<T extends TooltipState> = new (host: Tooltip) => T;

// The possible states that the system could be in, and the events that they can handle while in
// those states. Each state is responsible for one of two things: *scheduling* a timeout while
// waiting for any event that will cancel that timeout, or *transitioning* the dialog from hide to
// show.

// The tooltip isn't being shown, nor is anyone hovering near the anchor.
class TooltipInitial extends TooltipEvents {
    readonly type = "tooltip-hidden";

    constructor(host: Tooltip) {
        super(host);
        host.isOpen = false;
    }

    onAnchorEnter = () => {
        this.setState(ScheduledShow);
    };
}

// The tooltip is waiting to to be shown. This delay allows the user to cross the screen without
// spamming the user with tooltips popping up and hiding like some annoying cartoon.  Either
// the tooltip will be shown, or the show will be cancelled.
class ScheduledShow extends TooltipEvents {
    readonly type = "scheduled-show";

    constructor(host: Tooltip) {
        super(host);
        this.timer = setTimeout(() => {
            this.setState(TooltipShown);
        }, host.showDelay);
    }

    onAnchorLeave = () => {
        this.clearTimeout();
        this.setState(TooltipInitial);
    };
}

// The tooltip is now shown. The pointer or focus has activated one of the elements. If either
// issues a leave event, we schedule a hide.
class TooltipShown extends TooltipEvents {
    readonly type = "tooltip-shown";

    constructor(host: Tooltip) {
        super(host);
        host.isOpen = true;
    }

    onAnchorLeave = () => {
        this.setState(ScheduledHide);
    };

    onTooltipLeave = () => {
        this.onAnchorLeave();
    };
}

// One of the elements scheduled a hide. The tooltip will told to hide the tooltip after the delay,
// unless one of the visible elements cancels the hide due to an activation event.
class ScheduledHide extends TooltipEvents {
    readonly type = "hide-scheduled";

    constructor(host: Tooltip) {
        super(host);
        this.timer = setTimeout(() => {
            this.setState(TooltipInitial);
        }, host.hideDelay);
    }

    onTooltipEnter = () => {
        this.clearTimeout();
        this.setState(TooltipShown);
    };

    onTriggerEnter = () => {
        this.onTooltipEnter();
    };
}

type TooltipState = TooltipInitial | ScheduledShow | TooltipShown | ScheduledHide;

/**
 * @summary A **tooltip** is an image used to identify an organization, corporation or project.
 *
 * @csspart tooltip - The image element within the component
 *
 * @cssprop --pf-v5-c-tooltip--Width - Base width of the tooltip image (default: auto)
 * @cssprop --pf-v5-c-tooltip--Height - Base height of the tooltip image (default: auto)
 * @cssprop --pf-v5-c-tooltip--Width-on-sm - Width on small screens (≥576px)
 * @cssprop --pf-v5-c-tooltip--Width-on-md - Width on medium screens (≥768px)
 * @cssprop --pf-v5-c-tooltip--Width-on-lg - Width on large screens (≥992px)
 * @cssprop --pf-v5-c-tooltip--Width-on-xl - Width on extra large screens (≥1200px)
 * @cssprop --pf-v5-c-tooltip--Width-on-2xl - Width on 2x large screens (≥1450px)
 * @cssprop --pf-v5-c-tooltip--Height-on-sm - Height on small screens (≥576px)
 * @cssprop --pf-v5-c-tooltip--Height-on-md - Height on medium screens (≥768px)
 * @cssprop --pf-v5-c-tooltip--Height-on-lg - Height on large screens (≥992px)
 * @cssprop --pf-v5-c-tooltip--Height-on-xl - Height on extra large screens (≥1200px)
 * @cssprop --pf-v5-c-tooltip--Height-on-2xl - Height on 2x large screens (≥1450px)
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
     * @attr {string} trigger - What event causes the tooltip to show up.
     */
    @property({ type: String })
    trigger: Trigger = "hover";

    /**
     * @attr {string} showDelay - interval in milliseconds before the tooltip should show up. Used
     * to prevent spamming the screen with tooltips while the pointer scans across the page.
     */
    @property({ type: Number, attribute: "show-delay" })
    showDelay = 50;

    /**
     * @attr {string} hideDelay - interval in milliseconds before the tooltip should hide.
     */
    @property({ type: Number, attribute: "hide-delay" })
    hideDelay = 150;

    /**
     * @attr { number } offsetDistance - Distance from the anchor in pixels
     */
    @property({ type: Number, attribute: "offset" })
    offsetDistance = 8;

    /**
     * @attr { string } placement - Where should we place the tooltip?
     */
    @property({ type: String })
    placement: Placement = "top";

    @state()
    isOpen = false;

    #state: TooltipState = new TooltipInitial(this);

    #dialog: Ref<HTMLDialogElement> = createRef();

    @query('[part="arrow"]')
    arrow?: HTMLElement;

    #anchor: HTMLElement | null = null;
    #cleanupFloating?: () => void;
    #anchorAbortController = new AbortController();
    #tooltipAbortController = new AbortController();

    setState(state: TooltipState) {
        this.#state = state;
    }

    #onAnchorEnter = () => {
        this.#state.onAnchorEnter();
    };

    #onAnchorLeave = () => {
        this.#state.onAnchorLeave();
    };

    #onTooltipEnter = () => {
        this.#state.onTooltipEnter();
    };

    #onTooltipLeave = () => {
        this.#state.onTooltipLeave();
    };

    #attachToAnchor() {
        this.#anchor = null;

        if (!this.htmlFor) {
            console.warn("ak-tooltip: tooltip without anchor declared.");
            return;
        }
        const parent = this.getRootNode() as ParentNode;
        if (
            !(parent === document || parent instanceof HTMLElement || parent instanceof ShadowRoot)
        ) {
            console.warn("ak-tooltip: component not running in a valid context");
            return;
        }

        // Fallback to search based on selector, even if we're pretty sure it's an ID.
        const anchor = validHtmlId.test(this.htmlFor)
            ? parent.querySelector(`#${this.htmlFor}`) || parent.querySelector(this.htmlFor)
            : parent.querySelector(this.htmlFor);

        if (!anchor) {
            console.warn("ak-tooltip: could not find anchor");
            return;
        }

        if (!(anchor instanceof HTMLElement)) {
            console.warn(
                `ak-tooltip: element '${this.htmlFor}' does not resolve to an HTMLElement`
            );
            return;
        }

        this.#anchor = anchor;

        const signal = { signal: this.#anchorAbortController.signal };
        this.#anchor.addEventListener("focus", this.#onAnchorEnter, signal);
        this.#anchor.addEventListener("blur", this.#onAnchorLeave, signal);
        if (this.trigger === "hover") {
            this.#anchor.addEventListener("mouseenter", this.#onAnchorEnter, signal);
            this.#anchor.addEventListener("mouseleave", this.#onAnchorLeave, signal);
        }
    }

    #detachFromAnchor() {
        if (this.isOpen) {
            this.#detachDialogListeners();
        }
        if (this.#anchor) {
            this.#anchorAbortController.abort();
            this.#anchorAbortController = new AbortController();
        }
        this.#state.clearTimeout();
        this.#cleanupFloating?.();
    }

    public override connectedCallback() {
        super.connectedCallback();
        this.#attachToAnchor();
    }

    public override disconnectedCallback() {
        super.disconnectedCallback();
        this.#detachFromAnchor();
    }

    public override render() {
        const fromSlot = this.textContent?.trim() || this.childNodes.length > 0;
        const content = fromSlot ? html`<slot></slot>` : this.content;
        return html`<dialog ${ref(this.#dialog)} part="tooltip" role="tooltip" aria-live="polite">
            <div part="content">${content}</div>
            ${this.noArrow ? nothing : html`<div part="arrow"></div>`}
        </dialog>`;
    }

    #attachDialogListeners() {
        if (!this.isOpen) {
            throw new Error("Can't happen.");
        }

        const signal = { signal: this.#tooltipAbortController.signal };
        this.#dialog.value?.addEventListener("focus", this.#onTooltipEnter, signal);
        this.#dialog.value?.addEventListener("blue", this.#onTooltipLeave, signal);
        if (this.trigger === "hover") {
            this.#dialog.value?.addEventListener("mouseenter", this.#onTooltipEnter, signal);
            this.#dialog.value?.addEventListener("mouseleave", this.#onTooltipLeave, signal);
        }
    }

    #detachDialogListeners() {
        this.#tooltipAbortController.abort();
        this.#tooltipAbortController = new AbortController();
    }

    #updatePosition = async () => {
        const [anchor, dialog] = [this.#anchor, this.#dialog.value];
        if (!(anchor && dialog)) {
            return;
        }

        const middleware: Middleware[] = [
            offset(this.offsetDistance),
            flip(),
            shift({ padding: 8 }),
        ];

        if (this.arrow && !this.noArrow) {
            middleware.push(arrow({ element: this.arrow }));
        }

        const { x, y, placement, middlewareData } = await computePosition(anchor, dialog, {
            placement: this.placement,
            middleware,
        });

        Object.assign(dialog.style, {
            left: `${x}px`,
            top: `${y}px`,
        });

        if (this.arrow && !this.noArrow && middlewareData.arrow) {
            const { x, y } = middlewareData.arrow;
            const side = placement.split("-")[0];
            const staticSide = oppositeSideMap[side]!;
            const arrowOffset = -1 * (this.arrow.offsetWidth - 1);
            Object.assign(this.arrow.style, {
                left: x !== null ? `${x}px` : "",
                top: y !== null ? `${y}px` : "",
                right: "",
                bottom: "",
                [staticSide]: `${arrowOffset}px`,
            });
        }
    };

    #setPositioning() {
        const [anchor, dialog] = [this.#anchor, this.#dialog.value];
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
        const dialog = this.#dialog.value;
        if (!dialog) {
            return;
        }
        dialog.inert = true;
        dialog.show();
        dialog.inert = false;
    }

    #hideTooltip() {
        const dialog = this.#dialog.value;
        if (!dialog) {
            return;
        }
        dialog.close();
    }

    public override updated(changed: PropertyValues<this>) {
        if (changed.has("htmlFor")) {
            this.#detachFromAnchor();
            this.#attachToAnchor();
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
