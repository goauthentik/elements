import styles from "./ak-button.css";
import { buttonTemplate, linkTemplate } from "./ak-button.template.js";

import { InternalsController } from "@patternfly/pfe-core/controllers/internals-controller.js";
import { match, P } from "ts-pattern";

import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators/property.js";

/**
 * Variant types
 */
export const buttonVariant = [
    "primary",
    "secondary",
    "tertiary",
    "control",
    "plain",
    "link",
] as const;
export type ButtonVariant = (typeof buttonVariant)[number];

/**
 * Severity levels.
 */
export const buttonSeverity = ["danger", "warning"] as const;
export type ButtonSeverity = (typeof buttonSeverity)[number];

/**
 * Optional button sizes
 */
export const buttonSize = ["sm", "lg"] as const;
export type ButtonSize = (typeof buttonSize)[number];

/**
 * Button behaviors.
 */
export const buttonType = ["button", "submit", "reset"] as const;
export type ButtonType = (typeof buttonType)[number];

export interface IButton {
    download?: string;
    href?: string;
    label?: string;
    name?: string;
    rel?: string;
    target?: string;
    type?: ButtonType;
    value?: string;
    variant?: ButtonVariant;
}

/**
 * @element ak-button
 *
 * @summary A button component with multiple variants, sizes, and form integration capabilities
 *
 * @attr {ButtonType} type - Button behavior: "button" (default), "submit", "reset"
 * @attr {ButtonVariant} variant - Visual variant
 *   - "primary": Filled button with strong emphasis
 *   - "secondary": Outlined button with medium emphasis
 *   - "tertiary": Subtle button with low emphasis
 *   - "control": Button used in form controls
 *   - "plain": Icon button without background/border
 *   - "link": Looks like a hyperlink
 * @attr {ButtonSeverity} severity - Severity level: "danger", "warning"
 *   - "danger": Red styling for destructive actions
 *   - "warning": Yellow styling for cautionary actions
 * @attr {ButtonSize} size - Button size: "sm", "lg"
 *   - "small": Smaller than default. Used for compact settings.
 *   - "large": Larger than default. Used for CTAs.
 * @attr {string} name - Name attribute for the button
 * @attr {string} value - Value attribute when button is part of a form
 * @attr {string} label - Aria-accessible label for the button
 * @attr {string} theme - Color theme: "light", "dark"
 * @attr {string} href - URL to navigate to (for link variant)
 * @attr {string} target - Target attribute for link variant (e.g., "_blank")
 * @attr {boolean} disabled - Whether the button is disabled
 * @attr {boolean} block - Whether button occupies full width of container
 * @attr {boolean} inline - Whether button flows inline with text (removes host padding)
 * @attr {boolean} active - Whether button is in active state
 * @attr {boolean} expanded - Whether control variant button is in expanded state
 *
 * @fires click - Fired when button is clicked (unless disabled)
 *
 * @slot - Default slot for button content (text, icons, etc.)
 *
 * @csspart button - The button element (when not using href)
 * @csspart anchor - The anchor element (when href is provided)
 *
 * @cssprop --pf-v5-c-button--PaddingTop - Top padding of the button
 * @cssprop --pf-v5-c-button--PaddingRight - Right padding of the button
 * @cssprop --pf-v5-c-button--PaddingBottom - Bottom padding of the button
 * @cssprop --pf-v5-c-button--PaddingLeft - Left padding of the button
 * @cssprop --pf-v5-c-button--FontSize - Font size of button text
 * @cssprop --pf-v5-c-button--FontWeight - Font weight of button text
 * @cssprop --pf-v5-c-button--LineHeight - Line height of button text
 * @cssprop --pf-v5-c-button--BackgroundColor - Background color of the button
 * @cssprop --pf-v5-c-button--BorderRadius - Border radius of the button
 * @cssprop --pf-v5-c-button--after--BorderColor - Border color of the button
 * @cssprop --pf-v5-c-button--after--BorderWidth - Border width of the button
 * @cssprop --pf-v5-c-button--disabled--Color - Text color when disabled
 * @cssprop --pf-v5-c-button--disabled--BackgroundColor - Background color when disabled
 * @cssprop --pf-v5-c-button--m-primary--BackgroundColor - Primary variant background color
 * @cssprop --pf-v5-c-button--m-primary--Color - Primary variant text color
 * @cssprop --pf-v5-c-button--m-secondary--Color - Secondary variant text color
 * @cssprop --pf-v5-c-button--m-secondary--after--BorderColor - Secondary variant border color
 * @cssprop --pf-v5-c-button--m-tertiary--Color - Tertiary variant text color
 * @cssprop --pf-v5-c-button--m-tertiary--after--BorderColor - Tertiary variant border color
 * @cssprop --pf-v5-c-button--m-link--Color - Link variant text color
 * @cssprop --pf-v5-c-button--m-plain--Color - Plain variant text color
 * @cssprop --pf-v5-c-button--m-control--BackgroundColor - Control variant background color
 * @cssprop --pf-v5-c-button--m-danger--BackgroundColor - Danger severity background color
 * @cssprop --pf-v5-c-button--m-danger--Color - Danger severity text color
 * @cssprop --pf-v5-c-button--m-warning--BackgroundColor - Warning severity background color
 * @cssprop --pf-v5-c-button--m-warning--Color - Warning severity text color
 */
export class Button extends LitElement implements IButton {
    static readonly styles = [styles];

    static readonly formAssociated = true;

    @property({ reflect: true })
    public type?: ButtonType = "button";

    @property({ reflect: true })
    public variant: ButtonVariant = "primary";

    @property()
    public label?: string;

    @property()
    public name?: string;

    @property()
    public value?: string;

    @property()
    public href?: string;

    @property()
    public target?: string;

    @property()
    public rel?: string;

    @property()
    public download?: string;

    @property({ reflect: true, type: Boolean, attribute: "disabled" })
    protected _disabled = false;

    #internals = InternalsController.of(this, { role: "button" });

    protected get disabled() {
        return this._disabled || this.#internals.formDisabled;
    }

    private onClick = (event: MouseEvent) => {
        // Using `requestSubmit()` rather than `submit()`.  See:
        // https://github.com/WICG/webcomponents/issues/814

        // prettier-ignore
        match([this.disabled, this.type])
            .with([true, P._], () => { event.preventDefault(); })
            .with([false, "reset"], () => { this.#internals.form?.reset(); })
            .with([false, "submit"], () => { this.#internals.form?.requestSubmit(); })
            .otherwise(() => { /* no-op */ });
    };

    private onKeydown = (ev: KeyboardEvent) => {
        // Only proceed if the button is not disabled
        if (this.disabled) {
            return;
        }

        // Handle Enter and Space key presses
        if (ev.key === "Enter" || ev.key === " ") {
            if (ev.key === " ") {
                ev.preventDefault();
            }

            // Simulate a click
            const clickEvent = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
            });

            if (this.dispatchEvent(clickEvent)) {
                this.onClick(clickEvent);
            }
        }
    };

    public willUpdate(changed: PropertyValues<this>): void {
        super.willUpdate(changed);
        this.#internals.ariaLabel = this.label || null;
        this.#internals.ariaDisabled = String(!!this._disabled);
        if (this.variant === "link" && this.href) {
            this.tabIndex = -1;
        } else {
            this.tabIndex = this.disabled ? -1 : 0;
        }
    }

    public override render() {
        const { href, type, target, name, value, disabled, rel, download, onClick, onKeydown } =
            this;

        return this.variant === "link" && typeof href === "string"
            ? linkTemplate({ href, target, disabled, rel, download, onClick, onKeydown })
            : buttonTemplate({ disabled, type, name, value, onClick, onKeydown });
    }
}
