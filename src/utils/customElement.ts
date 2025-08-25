import { type LitElement } from "lit";

//#region Constructors

export type AbstractLitElementConstructor<T = unknown> = abstract new (
    ...args: unknown[]
) => LitElement & T;

export type LitElementConstructor<T = unknown> = new (...args: unknown[]) => LitElement & T;

//#endregion

/**
 * @function customElement
 *
 * Provides a little more logic to handling registration, and doesn't crash the process
 * when an element is pre-registered.
 *
 * @param element: string - the name of the HTML Custom Element
 * @param constructor: LitElement - the constructor function for the HTML Custom Element
 */

export function customElement(element: string, constructor: LitElementConstructor) {
    const preregistered = window.customElements.get(element);
    if (preregistered && preregistered === constructor) {
        return;
    }
    if (preregistered) {
        console.warn(
            `Request to redefine <$element>.  Either there is a name collision, ` +
                `or you have attempted to register different versions of the same component.`,
        );
    }
    window.customElements.define(element, constructor);
}
