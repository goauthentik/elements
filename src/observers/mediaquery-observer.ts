import { LitElement } from "lit";
import { property } from "lit/decorators/property.js";

/* Because MediaQueryLists are technically on the window rather than any one component, all we want
 * is a single listening instance. Components register the query/queries in which they're interested
 * with a decorator on a variable; when the query is triggered and iff the value is changed, the
 * variable is changed and requestUpdate is called with the changed state.
 */

/* This is a singleton class that keeps track of what elements are interested in what events. */

export type MediaQueryCallback = (state: boolean) => void;

type MediaQueryHandlers = {
    eventHandler: MediaQueryList;
    nodes: Map<HTMLElement, MediaQueryCallback>;
};

class MediaQueryMonitor {
    // eslint-disable-next-line sonarjs/public-static-readonly
    public static instance: MediaQueryMonitor;

    // Enforce singleton status; return existing instance if it's already defined.
    constructor() {
        if (MediaQueryMonitor.instance) {
            return MediaQueryMonitor.instance;
        }
        MediaQueryMonitor.instance = this;
    }

    /* A map of the query to a collection of elements and their callbacks. When we get a
     * media change event, we get the collection of elements that respond to it and call
     * those callbacks to notify them.
     */
    mediaQueries: Map<string, MediaQueryHandlers> = new Map();

    getOrCreateMediaQueryEventHandler(query: string) {
        let handler = this.mediaQueries.get(query);
        if (!handler) {
            const eventHandler = window.matchMedia(query);
            if (!eventHandler) {
                console.warn(`Unable to match media on query ${query}`);
                return null;
            }
            handler = { eventHandler, nodes: new Map() };
            this.mediaQueries.set(query, handler);
        }
        return handler;
    }

    handleMediaQueryChange = (ev: MediaQueryListEvent): void => {
        const callbacks = this.mediaQueries.get(ev.media);
        if (!callbacks) {
            return;
        }
        const { nodes } = callbacks;
        for (const [node, callback] of nodes) {
            // Corresponds to the `Parameters<mediaQueryCallback(this: T, state: boolean)>`
            // signature in the decorator.
            callback.call(node, ev.matches);
        }
    };

    observeMediaQuery(node: HTMLElement, query: string, callback: MediaQueryCallback) {
        if (!node) {
            return;
        }

        // Get or create the callback map for this query
        const mqEventHandler = this.getOrCreateMediaQueryEventHandler(query);
        if (!mqEventHandler) {
            return;
        }

        const { eventHandler, nodes } = mqEventHandler;

        eventHandler.addEventListener("change", this.handleMediaQueryChange);
        nodes.set(node, callback);
        callback.call(node, eventHandler.matches);
    }

    stopObserving(node: HTMLElement, query: string) {
        const mqEventHandler = this.mediaQueries.get(query);
        if (!mqEventHandler) {
            return;
        }

        const { eventHandler, nodes } = mqEventHandler;
        nodes.delete(node);

        // Last observer for this query - remove the event listener
        if (nodes.size === 0) {
            eventHandler.removeEventListener("change", this.handleMediaQueryChange);
            this.mediaQueries.delete(query);
        }
    }
}

const mediaQueryMonitor = new MediaQueryMonitor();

export function mediaQuery(query: string) {
    return <T extends LitElement, K extends keyof T>(proto: T, key: K) => {
        property({ attribute: false, useDefault: false })(proto, key);

        function mediaQueryCallback(this: T, state: boolean) {
            const cachedState = this[key];
            if (state !== cachedState) {
                Object.assign(this, { [key]: state });
                this.requestUpdate(key, cachedState);
            }
        }

        const { connectedCallback: origConnected, disconnectedCallback: origDisconnected } = proto;

        proto.connectedCallback = function (this: T) {
            origConnected?.call(this);
            mediaQueryMonitor.observeMediaQuery(this, query, mediaQueryCallback);
        };

        proto.disconnectedCallback = function (this: T) {
            origDisconnected?.call(this);
            mediaQueryMonitor.stopObserving(this, query);
        };
    };
}
