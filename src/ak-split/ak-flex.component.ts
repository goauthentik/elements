import { Autoslotter } from "./autoslotter.js";

import { MutationController } from "@lit-labs/observers/mutation-controller.js";
import { html, LitElement } from "lit";

/**
 * @summary A **flex** enforces a limited colleccion of flex layouts
 */
export abstract class Flex extends LitElement {
    readonly flexPrefix: string = "";

    #autoslotter = new Autoslotter(this);

    onChildChangeFlexFill = (records: MutationRecord[]) => {
        const children = new WeakSet(this.children);
        if (
            records.find(
                (record) =>
                    record.target &&
                    record.target instanceof Element &&
                    children.has(record.target),
            )
        ) {
            this.requestUpdate();
        }
    };

    private _observer = new MutationController(this, {
        config: {
            childList: false,
            subtree: true,
            attributes: true,
            attributeFilter: [`${this.flexPrefix}-fill`],
        },
        skipInitial: true,
        callback: this.onChildChangeFlexFill,
    });

    render() {
        const fillItem = (name: string) => {
            const selector = `[slot="${name}"]`;
            const selected = [...this.children].find((c) => c.matches(selector));
            return selected && selected.hasAttribute(`${this.flexPrefix}-fill`) ? " fill" : "";
        };

        return html`<div part=${this.flexPrefix}>
            ${this.#autoslotter.slots.map(
                (slot) =>
                    html`<div part="${this.flexPrefix}-item${fillItem(slot)}">
                        <slot name=${slot}></slot>
                    </div>`,
            )}
        </div>`;
    }
}
