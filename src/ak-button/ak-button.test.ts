// Import the component to register it
import "./ak-button.js";

import { spread } from "@open-wc/lit-helpers";
import { beforeEach, describe, expect, it } from "vitest";
import { render } from "vitest-browser-lit";
import { commands } from "vitest/browser";

import { html, type TemplateResult } from "lit";

// @ts-expect-error Typescript can't read from the source correctly.
const { $ } = commands;

describe("ak-button component", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    /**
     * Helper function to render an ak-button component
     *
     * @param content - Text content or Lit TemplateResult to render inside the button
     * @param properties - Properties to spread onto the component (e.g., variant, disabled)
     */
    const renderComponent = (content: string | TemplateResult = "Click me", properties = {}) => {
        return render(html`<ak-button ${spread(properties)}>${content}</ak-button>`);
    };

    it("renders as a button by default", async () => {
        const { getByRole, getByText } = renderComponent("Click here");
        const button = getByRole("button");
        expect(button).toBeTruthy();
        expect(button.getByText("Click here")).toBeTruthy();
    });

    /*
    it("renders as a link when specified", async () => {
        const { getByRole, getByText } = renderComponent("Click to leave", {
            variant: "link",
            href: "https://example.com",
        });

        // When variant="link", renders <a> tag instead of <button>
        const link = getByText("Click to leave");
        expect(link).toBeTruthy();
        expect(link).toHaveAttribute("href", "https://example.com");

        // Verify slotted text content
        const component = document.querySelector("ak-button");
        expect(component?.textContent?.trim()).toBe("Click to leave");
    });

    it("applies primary variant styles by default", async () => {
        const { getByRole } = renderComponent("Click me", { variant: "primary" });

        // Verify button exists in shadow DOM
        const button = getByRole("button");
        expect(button).toBeTruthy();

        // Component uses :host([variant="primary"]) attribute selectors for styling
        const component = document.querySelector("ak-button");
        expect(component).toHaveAttribute("variant", "primary");
    });

    it("applies severity styles when specified", async () => {
        const { getByRole } = renderComponent("Click me", { severity: "danger" });

        const button = getByRole("button");
        expect(button).toBeTruthy();

        // Component uses :host([severity="danger"]) attribute selectors for styling
        const component = document.querySelector("ak-button");
        expect(component).toHaveAttribute("severity", "danger");
    });

    it("applies disabled state when specified", async () => {
        // The "?disabled" syntax from @open-wc/lit-helpers sets a boolean property
        const { getByRole } = renderComponent("Click me", { "?disabled": true });
        const button = getByRole("button");
        expect.element(button).toHaveAttribute(button?.disabled).toBe(true);
    });

    it("triggers click events", async () => {
        renderComponent("Click me");

        // Track whether click event fired
        let buttonClicked = false;

        const component = document.querySelector("ak-button");
        expect(component).toBeTruthy();

        // Events bubble up from shadow DOM to the host element
        component!.addEventListener("click", () => {
            buttonClicked = true;
        });

        // page.getByRole queries through accessibility tree across shadow DOM
        await page.getByRole("button", { name: "Click me" }).click();

        expect(buttonClicked).toBe(true);
    });

    it("disabled buttons do not trigger click events", async () => {
        renderComponent("Click me", { "?disabled": true });

        let buttonClicked = false;

        const component = document.querySelector("ak-button");
        expect(component).toBeTruthy();

        component!.addEventListener("click", () => {
            buttonClicked = true;
        });

        // Verify button is disabled in shadow DOM
        const button = await getShadowElement<HTMLButtonElement>("button");
        expect(button?.disabled).toBe(true);

        // Try clicking the disabled button directly (simulates real user interaction)
        // In a real browser, clicking a disabled button element doesn't fire click events
        button?.click();

        // Verify click was NOT propagated to the component
        expect(buttonClicked).toBe(false);
    });
     */
});
