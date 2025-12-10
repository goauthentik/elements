import type { Tooltip } from "./ak-tooltip.component.js";

// Getting a better tooltip required meeting the goal that moving across the anchor quickly
// shouldn't cause the tooltip to show up immediately, as that would spam a display with a lot of
// tooltips. It also shouldn't fade out when the pointer transitions from the anchor to the tooltip
// itself.
//
// So when you hover or focus an anchor element, the tooltip is *scheduled to show*, which can be
// cancelled by leaving the anchor before it becomes visible. Likewise, when the tooltip is visible,
// the tooltip is *scheduled to hide* when the pointer transitions away, which can be cancelled
// by the pointer returning to hover or focus either element.
//
// This then becomes a state machine:
//
// - Hidden -> (mouseover anchor): Scheduled to Show
// - Scheduled to Show -> [(mouseout anchor): Show canceled: Hidden, otherwise: Show not cancelled: Showing]
// - Showing -> [Scheduled to hide]
// - Scheduled to Hide -> [(mouseover anchor or tooltip): Hide canceled: Showing,
//                          otherwise: Hide not cancelled: Hidden]
//
// The `TooltipEvent` class contains the API needed to support transitions from one state to another
// inside a `Tooltip`, and the four states inherit from it. It's completely self- contained, there's
// no "state manager"; a transition results in calls to the Tooltip API to show or hide, but
// timeouts are dependent on the state being live so they live on the state itself.

type Timeout = ReturnType<typeof setTimeout> | null;

abstract class TooltipEvents {
    protected type: string = "";
    protected timer: Timeout = null;
    protected host: Tooltip;

    constructor(protected host: Tooltip) {}

    public onTooltipEnter = () => {
        /* no op */
    };

    public onTooltipLeave = () => {
        /* no op */
    };

    public onAnchorEnter = () => {
        /* no op */
    };

    public onAnchorLeave = () => {
        /* no op */
    };

    // A little type magic means that we can avoid making an error with this call;
    protected setState<T extends TooltipState>(State: TooltipStateConstructor<T>) {
        this.clearTimeout();
        this.host.setState(new State(this.host));
    }

    public clearTimeout() {
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
export class TooltipInitialState extends TooltipEvents {
    readonly type = "tooltip-hidden";

    constructor(host: Tooltip) {
        super(host);
        host.isOpen = false;
    }

    public onAnchorEnter = () => {
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

    public onAnchorLeave = () => {
        this.setState(TooltipInitialState);
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

    public onAnchorLeave = () => {
        this.setState(ScheduledHide);
    };

    public onTooltipLeave = () => {
        this.onAnchorLeave();
    };
}

// One of the elements scheduled a hide. The tooltip will be told to hide the tooltip after the
// delay, unless one of the visible elements cancels the hide due to an activation event.
class ScheduledHide extends TooltipEvents {
    readonly type = "hide-scheduled";

    constructor(host: Tooltip) {
        super(host);
        this.timer = setTimeout(() => {
            this.setState(TooltipInitialState);
        }, host.hideDelay);
    }

    public onTooltipEnter = () => {
        this.setState(TooltipShown);
    };

    public onAnchorEnter = () => {
        this.onTooltipEnter();
    };
}

export type TooltipState = TooltipInitialState | ScheduledShow | TooltipShown | ScheduledHide;
