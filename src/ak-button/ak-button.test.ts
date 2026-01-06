// Import the component to register it
import "./ak-button.js";

import { spread } from "@open-wc/lit-helpers";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-lit";
import { page } from "vitest/browser";

import { html, type TemplateResult } from "lit";

describe("ak-button component", () => {
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
        const { getByRole } = renderComponent("Click here");
        const button = await getByRole("button");
        expect(button.getByText("Click here")).toBeTruthy();
        const element = button.element();
        expect(element.tagName).toBe("BUTTON");
    });

    it("renders as a link when specified", async () => {
        const { getByRole, getByText } = renderComponent("Click to leave", {
            variant: "link",
            href: "https://example.com",
        });

        // When variant="link", renders <a> tag instead of <button>
        const link = getByText("Click to leave");
        await expect.element(link).toBeTruthy();
        await expect.element(link).toHaveAttribute("href", "https://example.com");
        const element = getByRole("link").element();
        expect(element.tagName).toBe("A");

        // Verify slotted text content
        const component = document.querySelector("ak-button");
        expect(component?.textContent?.trim()).toBe("Click to leave");
    });

    it("applies disabled state when specified", async () => {
        const { getByRole } = renderComponent("Click here", { "?disabled": true });
        const button = await getByRole("button");
        expect(button.getByText("Click here")).toBeTruthy();
        const element = button.element();
        expect(element.tagName).toBe("BUTTON");
        await expect.element(button).toHaveAttribute("disabled");
    });

    it("triggers click events", async () => {
        const { getByRole } = renderComponent("Click here");
        const component = document.querySelector("ak-button");
        await expect.element(component).toBeTruthy();

        let buttonClicked = false;
        component!.addEventListener("click", () => {
            buttonClicked = true;
        });

        const button = await getByRole("button");
        expect(button.element().tagName).toBe("BUTTON");
        await button.click();
        expect(buttonClicked).toBe(true);
    });

    it("does not trigger click events when disabled", async () => {
        const { getByRole } = renderComponent("Click here", { "?disabled": true });
        const component = document.querySelector("ak-button");
        expect(component).toBeTruthy();

        let buttonClicked = false;
        component!.addEventListener("click", () => {
            buttonClicked = true;
        });

        const button = await getByRole("button");
        expect(button.element().tagName).toBe("BUTTON");
        // Playwright will normally avoid clicking a button that is marked "disabled." We want it to
        // try anyway.
        await button.click({ force: true });
        expect(buttonClicked).toBe(false);
    });

    it("when a link, it does not have an href when disabled", async () => {
        renderComponent("Click to leave", {
            "variant": "link",
            "href": "https://example.com",
            "?disabled": true,
        });

        const component = document.querySelector("ak-button");
        const anchor = await vi.waitUntil(() => component?.shadowRoot?.querySelector("a"));
        expect(anchor).not.toBeNull();
        const element = page.elementLocator(anchor!);
        await expect.element(element).toBeVisible();
        await expect.element(element).toHaveAttribute("id", "main");
        await expect.element(element).not.toHaveAttribute("href");
    });
});
