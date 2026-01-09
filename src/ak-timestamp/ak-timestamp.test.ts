// Import the component to register it
import "./ak-timestamp.js";

import { Timestamp } from "./ak-timestamp.js";

import { spread } from "@open-wc/lit-helpers";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-lit";
import { Locator, locators, page } from "vitest/browser";

import { html } from "lit";

locators.extend({
    getElement() {
        return "ak-timestamp";
    },
    getTime() {
        return "ak-timestamp >> time";
    },
    getWarning() {
        return 'ak-timestamp >> [part="warning"]';
    },
});

declare module "vitest/browser" {
    interface LocatorSelectors {
        getElement(): Locator;
        getTime(): Locator;
        getWarning(): Locator;
    }
}

describe("ak-timestamp component", () => {
    const renderComponent = async (properties = {}) =>
        render(html`<ak-timestamp ${spread(properties)}></ak-timestamp>`);

    it("renders the current time by default", async () => {
        renderComponent();
        const timestamp = await page.getElement();
        await expect(timestamp).toBeVisible();

        const timeElement = await page.getTime();
        await expect.element(timeElement).toBeVisible();
        await expect.element(timeElement).toHaveAttribute("datetime");
        await expect.element(timeElement).not.toHaveAttribute("datetime", "Invalid Date");
    });

    it("renders a specified date string", async () => {
        const testDate = "2023-01-15T12:30:00Z";
        renderComponent({ date: testDate });
        const timeElement = await page.getTime();
        await expect
            .element(timeElement)
            .toHaveAttribute("datetime", new Date(testDate).toISOString());
    });

    it("renders a specified date object", async () => {
        const testDate = new Date("2023-01-15T12:30:00Z");
        renderComponent({ ".raw": testDate });

        const timeElement = await page.getTime();
        await expect
            .element(timeElement)
            .toHaveAttribute("datetime", new Date(testDate).toISOString());
    });

    it("renders a specified timestamp number", async () => {
        const testTimestamp = 1673784600000; // 2023-01-15T12:30:00Z in milliseconds
        renderComponent({ date: testTimestamp });
        const timeElement = await page.getTime();
        await expect
            .element(timeElement)
            .toHaveAttribute("datetime", new Date(testTimestamp).toISOString());
    });

    it("renders a warning for invalid dates", async () => {
        renderComponent({ date: "not-a-date" });
        const warningElement = await page.getWarning();
        await expect.element(warningElement).toBeVisible();
        await expect.element(warningElement).toHaveTextContent("Failed to parse time");
    });

    it("applies date format correctly", async () => {
        // Create a specific test date
        const testDate = "2023-01-15T12:30:00Z";

        // Set date format to "short" and render
        renderComponent({ "date": testDate, "date-format": "short" });
        const element = (await page.getElement().element()) as Timestamp;
        const time = await page.getTime();
        const timeElement = await time.element();
        const shortTimeText = timeElement.textContent;

        await element.setAttribute("date-format", "long");
        await element.updateComplete;
        const longTimeElement = await time.element();
        const longTimeText = longTimeElement.textContent;

        // The two formats should be different
        expect(shortTimeText).not.toEqual(longTimeText);

        // Short format should be shorter than long format
        expect(shortTimeText.length).toBeLessThan(longTimeText.length);
    });
});
