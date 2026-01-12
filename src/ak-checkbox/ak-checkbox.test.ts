// Import the component to register it
import "./ak-checkbox.js";

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-lit";
import { Locator, locators, page } from "vitest/browser";

import { html } from "lit";

locators.extend({
    getElement() {
        return "ak-checkbox";
    },
    getCheckbox() {
        return 'ak-checkbox >> [part="checkbox"]';
    },
    getToggle() {
        return 'ak-checkbox >> [part="toggle"]';
    },
    getLabel() {
        return 'ak-checkbox >> [part="label"]';
    },
    getCheck() {
        return "ak-checkbox >> svg";
    },
});

declare module "vitest/browser" {
    interface LocatorSelectors {
        getElement(): Locator;
        getCheckbox(): Locator;
        getToggle(): Locator;
        getLabel(): Locator;
        getCheck(): Locator;
    }
}

const getCheckedStatus = async () => {
    const component = await page.getElement();
    const element = await component.element();
    return (element as HTMLInputElement).checked;
};

describe("ak-checkbox component", () => {
    describe("Basic functionality", () => {
        it("should render with default unchecked state", async () => {
            render(html`<ak-checkbox></ak-checkbox>`);

            const component = await page.getElement();
            await expect.element(component).toBeInTheDocument();
            await expect.element(component).toHaveAttribute("role", "checkbox");
            expect(await getCheckedStatus()).not.toBe(undefined);
            const toggle = await page.getToggle();
            await expect.element(toggle).toBeInTheDocument();
        });
    });

    it("should render in checked state when checked attribute is set", async () => {
        render(html`<ak-checkbox checked></ak-checkbox>`);

        const component = await page.getElement();
        await expect.element(component).toHaveAttribute("checked");
        expect(await (component.element() as HTMLInputElement).checked).toBeTruthy();
        await expect.element(component).toHaveAttribute("aria-checked", "true");

        // Should show checkmark icon
        const svg = await page.getCheck();
        await expect(svg).toBeInTheDocument();
    });

    it("should not show checkmark when unchecked", async () => {
        render(html`<ak-checkbox></ak-checkbox>`);

        // Should not show checkmark icon
        const svg = await page.getCheck();
        await expect(svg).not.toBeInTheDocument();
    });

    it("should toggle checked state when clicked", async () => {
        render(html`<ak-checkbox></ak-checkbox>`);

        const component = await page.getElement();
        expect(await getCheckedStatus()).toBeFalsy();

        await component.click();

        await expect(component).toHaveAttribute("aria-checked", "true");
        expect(await getCheckedStatus()).toBeTruthy();

        await component.click();

        await expect(component).toHaveAttribute("aria-checked", "false");
        expect(await getCheckedStatus()).toBeFalsy();
    });

    describe("Disabled state", () => {
        it("should render as disabled when disabled attribute is set", async () => {
            render(html`<ak-checkbox disabled></ak-checkbox>`);

            const component = await page.getElement();
            const element = component.element() as HTMLInputElement;

            await expect.element(component).toHaveAttribute("disabled");
            await expect.element(await page.getCheckbox()).toHaveAttribute("tabindex", "-1");
            expect(element.disabled).toBeTruthy();
        });

        it("should not toggle when clicked while disabled", async () => {
            render(html`<ak-checkbox disabled></ak-checkbox>`);

            const component = await page.getElement();
            await component.click({ force: true });

            const element = component.element() as HTMLInputElement;
            expect(await getCheckedStatus()).toBeFalsy();
        });
    });
});
