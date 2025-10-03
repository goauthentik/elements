import { ReactiveControllerHost, ReactiveController } from "lit";
import { Ref } from "lit/directives/ref.js";

type ReactiveControllerElement = ReactiveControllerHost & HTMLElement & { disabled?: boolean };

type AnyTarget = HTMLElement | Ref<HTMLElement> | string;

export class AsButtonController implements ReactiveController {
    #host: ReactiveControllerElement;
    #target: AnyTarget;
    #abortController: AbortController | null = null;

    public constructor(host: ReactiveControllerElement, target: AnyTarget) {
        this.#host = host;
        this.#target = target;
        this.#abortController = new AbortController();
    }

    protected get target(): HTMLElement | null {
        if (typeof this.#target === "string") {
            return this.#host.querySelector(this.#target) ?? null;
        }
        if (this.#target instanceof HTMLElement) {
            return this.#target;
        }
        return this.#target.value ?? null;
    }

    public hostConnected() {
        this.#abortController = new AbortController();
        const { signal } = this.#abortController;
        this.target?.addEventListener("click", this.#onClick, { signal });
        this.target?.addEventListener("keydown", this.#onKeydown, { signal });
    }

    public hostDisconnected() {
        this.#abortController?.abort();
        this.#abortController = null;
    }

    #onClick = () => {
        if (this.#host.disabled) {
            return;
        }

        this.#host.dispatchEvent(
            new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
            })
        );
    };

    #onKeydown = (ev: KeyboardEvent) => {
        if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            this.#onClick();
        }
    };
}
