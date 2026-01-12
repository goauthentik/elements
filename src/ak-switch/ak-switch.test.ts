// Import the component to register it
import "./ak-switch.js";

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-lit";
import { Locator, locators, page } from "vitest/browser";

import { html } from "lit";

locators.extend({
    getComponent() {
        return "ak-switch";
    },
    getSwitch() {
        return 'ak-switch >> [part="switch"]';
    },
    getToggle() {
        return 'ak-switch >> [part="toggle"]';
    },
    getIcon() {
        return 'ak-switch >> [part="toggle-icon"]';
    },
    getLabel() {
        return 'ak-switch >> [part="label"]';
    },
});

declare module "vitest/browser" {
    interface LocatorSelectors {
        getComponent(): Locator;
        getSwitch(): Locator;
        getToggle(): Locator;
        getLabel(): Locator;
        getCheck(): Locator;
    }
}

const getSwitchStatus = async () => {
    const component = await page.getElement();
    const element = await component.element();
    return (element as HTMLInputElement).checked;
};

describe("ak-switch component", () => {
    describe("Basic functionality", () => {
        it("should render with default unchecked state", async () => {
            render(html`<ak-switch></ak-switch>`);

            const component = await page.getComponent();
            await expect.element(component).toBeInTheDocument();
            await expect.element(component).toHaveAttribute("role", "switch");
            expect(await getSwitchStatus()).toBeFalsy();
            await expect(await page.getToggle()).toBeInTheDocument();
        });

        it("should render in checked state when checked attribute is set", async () => {
            render(html`<ak-switch checked></ak-switch>`);

            const component = await page.getComponent();
            await expect.element(component).toHaveAttribute("checked");
            expect(await getSwitchStatus()).toBeTruthy();
            await expect.element(component).toHaveAttribute("aria-checked", "true");
        });

        it("should toggle checked state when clicked", async () => {
            render(html`<ak-switch></ak-switch>`);

            const component = await page.getComponent();
            expect(await getSwitchStatus()).toBeFalsy();

            await component.click();
            await browser.pause(50);

            expect(await getSwitchStatus()).toBeTruthy();
            await expect.element(component).toHaveAttribute("aria-checked", "true");

            await component.click();
            await browser.pause(50);

            expect(await getSwitchStatus()).toBeFalsy();
            await expect.element(component).toHaveAttribute("aria-checked", "false");
        });
    });

    describe("Disabled state", () => {
        it("should render as disabled when disabled attribute is set", async () => {
            render(html`<ak-switch disabled></ak-switch>`);

            const component = await page.getComponent();
            await expect.element(component).toHaveAttribute("disabled");
            await expect(await page.getSwitch()).toHaveAttribute("tabindex", "-1");
        });

        it("should not toggle when clicked while disabled", async () => {
            render(html`<ak-switch disabled></ak-switch>`);

            const component = await page.getComponent();
            await component.click();
            await browser.pause(50);

            expect(await getSwitchStatus()).toBeFalsy();
        });
    });
});
