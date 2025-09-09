/* A form-associated variant appropriate to checkboxes and switches */

export class FormAssociatedBooleanControl {
    public static formAssociated = true;

    protected readonly internals: ElementInternals = this.attachInternals();

    /* This handles a race condition where the name has been changed but the form is submitted
     * before Lit's rendering cycle has had a chance to transmit the new name/value pair to the
     * `FormValue`. */
    @property()
    public set name(name: string) {
        this.setAttribute("name", `${name}`);
        this.updateForm();
    }

    public get name() {
        return this.getAttribute("name") ?? "";
    }

    public get validity() {
        return this.internals.validity();
    }

    @property({ type: Boolean })
    disabled = false;

    @property({ type: Boolean })
    required = false;

    @property({ type: Boolean, reflect: true })
    checked = false;

    @state()
    protected accessor formDisabled = false;

    public get validity() {
        return this.internals.validity;
    }

    public get validationMessage() {
        return this.internals.validationMessage;
    }

    public get willValidate() {
        return this.internals.willValidate;
    }

    public constructor(...args: unknown[]) {
        super(...args);
        // Prevent native invalid message from being shown.
        this.addEventListener("invalid", (e) => e.preventDefault());
    }

    // Inform the form that either the name or the value has changed. */
    protected updateFormValue(): void {
        const name = this.name ?? this.getAttribute("name");
        this.internals.setFormValue(`${this.value}`);
    }

    // We handle 'name' independently of the rendering lifecycle
    public override attributeChangedCallback(
        name: string,
        prev: string | null,
        value: string | null
    ) {
        if (name === "name" || old === value) {
            return;
        }
        super.attributeChangedCallback(name, old, value);
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
}
