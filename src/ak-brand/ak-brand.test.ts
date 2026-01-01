import "./ak-brand.js";

import { spread } from "@open-wc/lit-helpers";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-lit";
import { Locator, locators, page } from "vitest/browser";

import { html } from "lit";

locators.extend({
    getBrand() {
        return "ak-brand";
    },
    getBrandImage() {
        return "ak-brand >> img";
    },
});

declare module "vitest/browser" {
    interface LocatorSelectors {
        getBrand(): Locator;
        getBrandImage(): Locator;
    }
}

describe("ak-brand component", () => {
    const renderComponent = async (properties = {}) => {
        return render(html`<ak-brand ${spread(properties)}></ak-brand>`);
    };

    it("renders with basic attributes", async () => {
        renderComponent({
            src: "/test-logo.svg",
            alt: "Test Logo",
        });

        const brand = await page.getBrand();
        const img = await page.getBrandImage();

        await expect.element(brand).toBeVisible();
        await expect.element(img).toBeVisible();
        await expect.element(img).toHaveAttribute("src", "/test-logo.svg");
        await expect.element(img).toHaveAttribute("alt", "Test Logo");
        await expect.element(img).toHaveAttribute("loading", "lazy");
    });

    it("handles missing src attribute", async () => {
        renderComponent({
            alt: "Test Logo",
        });

        const brand = await page.getBrand();
        const img = await page.getBrandImage();
        await expect.element(brand).toBeVisible();
        await expect.element(img).toBeVisible();
        await expect.element(img).not.toHaveAttribute("src");
    });
});
