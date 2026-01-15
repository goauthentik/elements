// Import the component to register it
import "./ak-spinner.js";

import { spread } from "@open-wc/lit-helpers";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-lit";
import { Locator, locators, page } from "vitest/browser";

import { html } from "lit";

locators.extend({
    getElement() {
        return "ak-spinner";
    },
    getSpinner() {
        return 'ak-spinner >> [part="spinner"]';
    },
    getCircle() {
        return 'ak-spinner >> [part="circle"]';
    },
});

declare module "vitest/browser" {
    interface LocatorSelectors {
        getElement(): Locator;
        getSpinner(): Locator;
        getCircle(): Locator;
    }
}

describe("ak-spinner component", function () {
    const renderComponent = async (properties = {}) => {
        render(html`<ak-spinner ${spread(properties)}></ak-spinner>`);
    };

    it("renders basic spinner", async () => {
        renderComponent();

        const spinner = await page.getElement();
        const svg = await page.getSpinner();
        await expect.element(spinner).toBeInTheDocument();
        await expect.element(svg).toBeInTheDocument();
        await expect.element(svg).toHaveAttribute("role", "progressbar");
    });

    it("forwards custom label", async () => {
        renderComponent({ label: "Custom loading message" });
        const svg = await page.getSpinner();
        await expect.element(svg).toHaveAttribute("aria-label", "Custom loading message");
    });

    it("uses default label when not specified", async () => {
        renderComponent();
        const svg = await page.getSpinner();
        const ariaLabel = await svg.element().getAttribute("aria-label");
        expect(ariaLabel).not.toBeNull();
        expect(ariaLabel!.length).toBeGreaterThan(0);
    });
});
