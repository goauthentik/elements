import { ReactiveController, ReactiveControllerHost } from "lit";

type ReactiveControllerElement = ReactiveControllerHost & HTMLElement;
type CallbackThunk = () => void;

const unnamed = Symbol("unnamed-slot");
type SlotName = string | typeof unnamed;

const nodeIsText = (node: Node): node is Text => node.nodeType === Node.TEXT_NODE;
const nodeIsElement = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;

const setsEqual = (set1: Set<SlotName>, set2: Set<SlotName>) =>
    set1.size === set2.size && Array.from(set1.values()).every((v) => set2.has(v));

/**
 * Our most basic slot controller.  It *does not care* what the slots are named or if those slots
 * even exist in the shadowDOM.  If an immediate child element of the lightDOM wants to know if
 * a slot request exists, this controller will track it.
 *
 * The constructor takes two or three arguments:
 * ```
 *     // Takes callback, does not track "default" slotted content.
 *     slotController = new DynamicSlotController(this, callback);
 *
 *     // Takes callback, tracks "default" slotted content.
 *     slotController = new DynamicSlotController(this, callback, true);
 *
 *     // No callback, does not track "default" slotted content.
 *     slotController = new DynamicSlotController(this, true);
 *
 *     // No callback, tracks "default" slotted content.
 *     slotController = new DynamicSlotController(this, true);
 *```
 */

export class DynamicSlotController implements ReactiveController {
    #slots = new Set<SlotName>();

    /**
     * @property {SlotName[]} slots - List of currently active slots
     *
     * If `trackDefault` is true and there is any child content that is either a valid element or
     * non-whitespace text, `null` will be included as a signal that there is default content.
     *
     */
    public get slots() {
        return Array.from(this.#slots.values()).map((c) => (c === unnamed ? null : c));
    }

    /**
     * @function {has} boolean - Returns true if the slot named as the paramater exists. Takes
     * `null` to ask if the default slot is populated.
     *
     * @param {string|null} - name of the slot to inquire about.
     */
    public has(name: string | null) {
        return this.#slots.has(name ?? unnamed);
    }

    #trackDefault = false;

    #host: ReactiveControllerElement;

    #callback?: CallbackThunk;

    #mutationObserver?: MutationObserver;

    public constructor(
        host: ReactiveControllerElement,
        callback?: CallbackThunk | boolean,
        trackDefault?: boolean,
    ) {
        if (typeof callback === "boolean") {
            trackDefault = callback;
            callback = undefined;
        }

        this.#host = host;
        this.#callback = callback;
        this.#trackDefault = Boolean(trackDefault);
        this.#host.addController(this);
    }

    #scanForSlots() {
        const foundSlots = new Set<SlotName>(
            Array.from(this.#host.children)
                .map((child) => child.getAttribute("slot"))
                .filter((name) => typeof name === "string"),
        );

        if (this.#trackDefault) {
            const hasDefaultSlotContent = Array.from(this.#host.childNodes).some((node: Node) => {
                return (
                    (nodeIsText(node) && node.textContent?.trim()) ||
                    (nodeIsElement(node) && node.getAttribute("slot") === null)
                );
            });

            if (hasDefaultSlotContent) {
                foundSlots.add(unnamed);
            }
        }

        if (!setsEqual(this.#slots, foundSlots)) {
            this.#slots = foundSlots;
            this.#callback?.();
        }
    }

    #onContentChange = (mutations: MutationRecord[]) => {
        const needUpdate = mutations.some(
            (m) =>
                m.type === "childList" || (m.type === "attributes" && m.attributeName === "slot"),
        );
        if (needUpdate) {
            this.#scanForSlots();
        }
    };

    public hostConnected() {
        // The hostConnected signal happens when the *lead tag* appears in the document. At that
        // moment, lightDOM has *not* yet been parsed. Using setTimeout() allows us to schedule the
        // scan and set up the mutation observer after the first parse pass is completed.
        setTimeout(() => {
            this.#scanForSlots();
            this.#mutationObserver = new MutationObserver(this.#onContentChange);
            this.#mutationObserver.observe(this.#host, {
                childList: true,
                attributes: true,
                attributeFilter: ["slot"],
                subtree: false,
            });
        });
    }

    public hostDisconnected() {
        this.#mutationObserver?.disconnect();
    }
}
