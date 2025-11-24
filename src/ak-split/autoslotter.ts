import { MutationController } from "@lit-labs/observers/mutation-controller.js";
import { LitElement, ReactiveController, ReactiveControllerHost } from "lit";

/* eslint-disable-next-line sonarjs/pseudo-random */
const slotBaseId = () => `${new Date().getTime()}${Math.random().toString(36).slice(2)}`;

const [REQUEST, DONT_REQUEST] = [true, false];

type ReactiveControllerHostElement = ReactiveControllerHost & LitElement;

export class Autoslotter implements ReactiveController {
    public host: ReactiveControllerHostElement;
    public key: string = "slot";

    // eslint-disable-next-line no-unused-private-class-members
    #observer: MutationController;
    #slotted: WeakMap<HTMLElement, string> = new WeakMap();
    #slots: string[] = [];
    #counter = 0;
    #id = slotBaseId();

    get slots() {
        return this.#slots;
    }

    get children() {
        return Array.from(this.host.children);
    }

    constructor(host: ReactiveControllerHostElement, key?: string) {
        this.key = key ?? this.key;
        this.host = host;
        this.host.addController(this);
        this.#observer = new MutationController(this.host, {
            config: {
                childList: true,
                attributes: false,
                subtree: false,
            },
            target: this.host,
            skipInitial: true,
            // The callback wants to pass a `MutationRecord[]`, but since we're only tracking
            // `childList` and we need to scan them all when that happens, this mitigates the
            // mistype between the callback and the method.
            callback: () => this.updateSlots(),
        });
    }

    protected updateSlots = (request = REQUEST) => {
        const children: HTMLElement[] = this.children.filter((c) => c instanceof HTMLElement);
        this.#slots = children.map((child) => {
            let name = this.#slotted.get(child);
            if (!name) {
                this.#counter += 1;
                name = `${this.key}-${this.#id}-${this.#counter}`;
                child.slot = name;
                this.#slotted.set(child, name);
            }
            return name;
        });
        if (request) {
            this.host.requestUpdate();
        }
    };

    public hostConnected() {
        this.updateSlots(DONT_REQUEST);
    }
}
