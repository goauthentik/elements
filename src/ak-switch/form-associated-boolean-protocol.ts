import { LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { match, P } from "ts-pattern";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = Record<string, unknown>> = new (...args: any[]) => T;
export type LitConstructor<T extends LitElement = LitElement> = Constructor<T>;

export interface IFormAssociatedBoolean {
    name: string;
    value?: string | null;
    disabled: boolean;
    required: boolean;
    checked: boolean;
    touched: boolean;
    focused: boolean;
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

        #checked = false;

        @property({ type: Boolean, reflect: true })
        public set checked(checked: boolean) {
            this.#checked = checked;
            this.updateFormValue();
        }

        public get checked() {
            return this.#checked;
        }

        @state()
        public touched = false;

        @state()
        public focused = false;

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
            value: string | null
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

        public onBlur = () => {
            this.focused = false;
            this.checkValidity();
        };

        public onInvalid = (ev: Event) => {
            // Prevent the message from being propagated upwards, since we'll be doing our own
            // management of how the error message is to be displayed.
            ev.preventDefault();
            this.internals.setValidity(this.validity, this.validationMessage);
            this.touched = true;
        };

        public onFocus = () => {
            this.touched = true;
            this.focused = true;
        };
    }

    return FormAssociatedBooleanControl as FormAssociatedBooleanMixin<Base>;
}
