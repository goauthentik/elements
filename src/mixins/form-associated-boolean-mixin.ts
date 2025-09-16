import { match, P } from "ts-pattern";

import { msg } from "@lit/localize";
import { LitElement, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = Record<string, unknown>> = new (...args: any[]) => T;
export type LitConstructor<T extends LitElement = LitElement> = Constructor<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isElement = (v: any): v is Element => v instanceof Node && v.nodeType === 1;

export interface IFormAssociatedBoolean {
    name: string;
    value?: string | null;
    disabled: boolean;
    required: boolean;
    checked: boolean;
    internals: ElementInternals;
    readonly form: HTMLFormElement | null;
    readonly labels: NodeList;
    readonly validity: ValidityState;
    readonly validationMessage: string;
    readonly willValidate: boolean;
    checkValidity(): boolean;
    reportValidity(): boolean;
    onBlur(): void;
    onInvalid(ev: Event): void;
    onFocus(): void;
    setAriaAttribute(name: string, value: string | null): void;
}

export type FormAssociatedBooleanMixin<Base extends LitConstructor> = Base &
    Constructor<IFormAssociatedBoolean>;

/* A form-associated variant appropriate to checkboxes and switches */

export function FormAssociatedBooleanMixin<Base extends LitConstructor>(Superclass: Base) {
    class FormAssociatedBooleanControl extends Superclass {
        public static readonly formAssociated = true;

        public readonly internals: ElementInternals = this.attachInternals();

        // Updates DOM attribute and form value synchronously. If we relied on Lit's render cycle to
        // reflect this change, there's a race condition where a submit could send the previous
        // name/value tuple before the Form is informed of the change.
        @property()
        public set name(name: string) {
            this.setAttribute("name", `${name}`);
            this.updateFormValue();
        }

        public get name() {
            return this.getAttribute("name") ?? "";
        }

        @property()
        public value?: string | null;

        @property({ type: Boolean })
        public disabled = false;

        @property({ type: Boolean })
        public required = false;

        @property({ type: String, attribute: "aria-label" })
        public ariaLabel: string | null = null;

        #checked = false;

        @property({ type: Boolean, reflect: true })
        public set checked(checked: boolean) {
            this.#checked = checked;
            this.updateFormValue();
        }

        public get checked() {
            return this.#checked;
        }

        protected defaultValue = false;

        @state()
        protected touched = false;

        @state()
        protected focused = false;

        public get form() {
            return this.internals.form;
        }

        public get labels() {
            return this.internals.labels;
        }

        public get validity() {
            return this.internals.validity;
        }

        public get validationMessage() {
            return this.internals.validationMessage;
        }

        public get willValidate() {
            return this.internals.willValidate;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public constructor(...args: any[]) {
            super(...args);
            this.addEventListener?.("focus", this.onFocus);
            this.addEventListener?.("blur", this.onBlur);
            this.addEventListener?.("invalid", this.onInvalid);
            this.addEventListener?.("click", this.onClick);
            this.addEventListener?.("keydown", this.onKeyDown);
        }

        connectedCallback() {
            super.connectedCallback();
            this.defaultValue = Boolean(this.hasAttribute("checked"));
        }

        // Inform the form that either the name or the value has changed. */
        protected updateFormValue(): void {
            const value = match([this.checked, Boolean(this.value)])
                .with([true, true], () => this.value ?? null)
                .with([true, false], () => "on")
                .with([false, P._], () => null)
                .exhaustive();
            this.internals.setFormValue(value);
        }

        // We handle 'name' independently of the rendering lifecycle
        public override attributeChangedCallback(
            name: string,
            prev: string | null,
            value: string | null,
        ) {
            if (name === "name" || prev === value) {
                return;
            }
            super.attributeChangedCallback(name, prev, value);
        }

        // We include both of these, since they're both valid calls a user might make of the component.
        // However, since we don't allow the `invalid` event to propogate, they have the exact same
        // semantics: they only "check," they do not "report."
        public checkValidity() {
            return this.internals.checkValidity();
        }

        public reportValidity() {
            return this.internals.reportValidity();
        }

        protected validateRequired() {
            if (this.required && !this.checked) {
                this.internals.setValidity({ valueMissing: true }, msg("This field is required"));
                return;
            }
            this.internals.setValidity({});
        }

        public onBlur = () => {
            this.focused = false;
        };

        public onInvalid = (ev: Event) => {
            // Prevent the message from being propagated upwards, since we'll be doing our own
            // management of how the error message is to be displayed.
            ev.preventDefault();
            this.touched = true;
        };

        public onFocus = () => {
            this.focused = true;
        };

        #onInteract() {
            this.touched = true;
            this.checked = !this.checked;
            this.validateRequired();
        }

        public onClick = (event: Event) => {
            if (this.disabled) {
                event.preventDefault();
                return;
            }
            this.#onInteract();
        };

        public onKeyDown = (event: KeyboardEvent) => {
            if (this.disabled || !(event.key === " " || event.key === "Enter")) {
                return;
            }
            event.preventDefault();
            this.#onInteract();
        };

        formResetCallback() {
            this.checked = this.defaultValue; // Or whatever the default should be
            this.touched = false;
            this.focused = false;
            this.internals.setValidity({}); // Clear any validation errors
        }

        formDisabledCallback(disabled: boolean) {
            this.disabled = disabled;
        }

        formStateRestoreCallback(state: string) {
            this.checked = state === "on" || state === this.value;
        }

        protected setAriaLabels() {
            const labels = [...this.internals.labels]
                .map((label) => (isElement(label) ? label.id : null))
                .filter((id) => id);
            this.removeAttribute("aria-labelledby");
            // "The aria-labelledby property has the highest precedence when browsers calculate
            // accessible names. Be aware that it overrides other methods of naming the element,
            // including aria-label, other naming attributes, and even the element's contents."
            // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby
            if (labels.length > 0) {
                this.setAttribute("aria-labelledby", labels.join(" "));
            }
        }

        protected setAriaAttribute(name: string, value: string | null) {
            if (value === null) {
                this.removeAttribute(name);
                return;
            }
            return this.setAttribute(name, value);
        }

        public override updated(changed: PropertyValues<this>) {
            super.updated(changed);
            this.setAriaLabels();
            this.setAriaAttribute("aria-checked", this.checked ? "true" : "false");
            this.setAriaAttribute("aria-disabled", this.disabled ? "true" : null);

            if (changed.has("checked")) {
                this.dispatchEvent(
                    new CustomEvent("change", {
                        detail: {
                            checked: this.checked,
                            value: this.value,
                        },
                        bubbles: true,
                        composed: true,
                    }),
                );
            }
        }
    }

    return FormAssociatedBooleanControl as FormAssociatedBooleanMixin<Base>;
}
