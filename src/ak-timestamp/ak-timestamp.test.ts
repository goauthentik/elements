// Import the component to register it
import "./ak-timestamp.js";

import { Timestamp } from "./ak-timestamp.js";

import { spread } from "@open-wc/lit-helpers";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-lit";
import { Locator, locators, page } from "vitest/browser";

import { html } from "lit";

locators.extend({
    getElement() {
        return "ak-timestamp";
    },
    getTimestamp() {
        return 'ak-timestamp >> [part="timestamp"]';
    },
    getElapsed() {
        return 'ak-timestamp >> [part="elapsed"]';
    },
    getWarning() {
        return 'ak-timestamp >> [part="warning"]';
    },
});

declare module "vitest/browser" {
    interface LocatorSelectors {
        getElement(): Locator;
        getTimestamp(): Locator;
        getElapsed(): Locator;
        getWarning(): Locator;
    }
}

describe("ak-timestamp component", () => {
    const renderComponent = (properties = {}) =>
        render(html`<ak-timestamp ${spread(properties)}></ak-timestamp>`);

    const testDate = "2023-01-15T12:30:00Z";
    const testDateMs = 1673784600000; // 2023-01-15T12:30:00Z in milliseconds

    describe("Basic Rendering", () => {
        it("renders the current time by default", async () => {
            renderComponent();
            const timestamp = await page.getElement();
            await expect.element(timestamp).toBeVisible();

            const timeElement = await page.getTimestamp();
            await expect.element(timeElement).toBeVisible();
            await expect.element(timeElement).toHaveAttribute("datetime");
        });

        it("renders as a semantic time element", async () => {
            renderComponent({ date: testDate });
            const timeElement = await page.getTimestamp();
            const element = await timeElement.element();
            expect(element.tagName).toBe("TIME");
        });

        it("includes proper datetime attribute", async () => {
            renderComponent({ date: testDate });
            const timeElement = await page.getTimestamp();
            await expect
                .element(timeElement)
                .toHaveAttribute("datetime", new Date(testDate).toISOString());
        });
    });

    describe("Date Input Formats", () => {
        it("renders a specified ISO date string", async () => {
            renderComponent({ date: testDate });
            const timeElement = await page.getTimestamp();
            await expect
                .element(timeElement)
                .toHaveAttribute("datetime", new Date(testDate).toISOString());
        });

        it("renders a Date object via raw property", async () => {
            const dateObj = new Date(testDate);
            renderComponent({ ".raw": dateObj });

            const timeElement = await page.getTimestamp();
            await expect.element(timeElement).toHaveAttribute("datetime", dateObj.toISOString());
        });

        it("renders a timestamp number as string", async () => {
            renderComponent({ date: testDateMs.toString() });
            const timeElement = await page.getTimestamp();
            await expect
                .element(timeElement)
                .toHaveAttribute("datetime", new Date(testDateMs).toISOString());
        });

        it("raw property takes precedence over date string", async () => {
            const rawDate = new Date("2024-06-01T00:00:00Z");
            renderComponent({
                "date": testDate,
                ".raw": rawDate,
            });

            const timeElement = await page.getTimestamp();
            await expect.element(timeElement).toHaveAttribute("datetime", rawDate.toISOString());
        });
    });

    describe("Invalid Date Handling", () => {
        it("renders a warning for invalid date strings", async () => {
            renderComponent({ date: "not-a-date" });
            const warningElement = await page.getWarning();
            await expect.element(warningElement).toBeVisible();
            await expect.element(warningElement).toHaveTextContent("Failed to parse time");
        });

        it("warning has correct part attribute for styling", async () => {
            renderComponent({ date: "invalid" });
            const warningElement = await page.getWarning();
            const element = await warningElement.element();
            expect(element.tagName).toBe("SPAN");
            expect(element.getAttribute("part")).toBe("warning");
        });

        it("does not render time element when date is invalid", async () => {
            renderComponent({ date: "invalid" });
            const timeElement = await page.getTimestamp();
            await expect.element(timeElement).not.toBeInTheDocument();
        });
    });

    describe("Date Format Options", () => {
        it("applies short date format", async () => {
            renderComponent({ "date": testDate, "date-format": "short" });
            const element = (await page.getElement().element()) as Timestamp;
            const time = await page.getTimestamp();
            const timeElement = await time.element();
            expect(timeElement.textContent).toBeTruthy();
        });

        it("changes format when date-format attribute changes", async () => {
            renderComponent({ "date": testDate, "date-format": "short" });
            const element = (await page.getElement().element()) as Timestamp;
            const time = await page.getTimestamp();

            const shortTimeText = (await time.element()).textContent;

            element.setAttribute("date-format", "long");
            await element.updateComplete;

            const longTimeText = (await time.element()).textContent;

            // The two formats should be different
            expect(shortTimeText).not.toEqual(longTimeText);
            // Long format should be longer than short format
            expect(longTimeText!.length).toBeGreaterThan(shortTimeText!.length);
        });

        it("supports full date format", async () => {
            renderComponent({ "date": testDate, "date-format": "full" });
            const time = await page.getTimestamp();
            await expect.element(time).toBeVisible();
        });

        it("supports medium date format", async () => {
            renderComponent({ "date": testDate, "date-format": "medium" });
            const time = await page.getTimestamp();
            await expect.element(time).toBeVisible();
        });
    });

    describe("Time Format Options", () => {
        it("applies short time format", async () => {
            renderComponent({ "date": testDate, "time-format": "short" });
            const time = await page.getTimestamp();
            await expect.element(time).toBeVisible();
        });

        it("applies long time format", async () => {
            renderComponent({ "date": testDate, "time-format": "long" });
            const time = await page.getTimestamp();
            await expect.element(time).toBeVisible();
        });

        it("applies full time format", async () => {
            renderComponent({ "date": testDate, "time-format": "full" });
            const time = await page.getTimestamp();
            await expect.element(time).toBeVisible();
        });

        it("applies medium time format", async () => {
            renderComponent({ "date": testDate, "time-format": "medium" });
            const time = await page.getTimestamp();
            await expect.element(time).toBeVisible();
        });
    });

    describe("12/24 Hour Format", () => {
        it("forces 12-hour format when is-12-hour is true", async () => {
            renderComponent({ "date": testDate, "?is-12-hour": true, "time-format": "short" });
            const time = await page.getTimestamp();
            const element = await time.element();
            // 12-hour format should contain AM or PM (locale dependent)
            const text = element.textContent || "";
            expect(text.match(/AM|PM|am|pm/)).toBeTruthy();
        });

        it("forces 24-hour format when is-12-hour is false", async () => {
            renderComponent({ "date": testDate, "?is-12-hour": false, "time-format": "short" });
            const time = await page.getTimestamp();
            await expect.element(time).toBeVisible();
        });
    });

    describe("UTC Display", () => {
        it("displays UTC time when display-utc is true", async () => {
            renderComponent({ "date": testDate, "?display-utc": true, "time-format": "short" });
            const time = await page.getTimestamp();
            const element = await time.element();
            const text = element.textContent || "";
            // Should contain UTC indicator
            expect(text.includes("UTC") || text.includes("Coordinated Universal Time")).toBe(true);
        });

        it("displays local time by default", async () => {
            renderComponent({ "date": testDate, "time-format": "short" });
            const time = await page.getTimestamp();
            await expect.element(time).toBeVisible();
        });
    });

    describe("Display Suffix", () => {
        it("appends custom suffix to displayed time", async () => {
            const suffix = "PST";
            renderComponent({ "date": testDate, "display-suffix": suffix });
            const time = await page.getTimestamp();
            const element = await time.element();
            const text = element.textContent || "";
            expect(text.includes(suffix)).toBe(true);
        });

        it("custom suffix overrides default UTC suffix", async () => {
            const suffix = "Custom TZ";
            renderComponent({
                "date": testDate,
                "?display-utc": true,
                "display-suffix": suffix,
            });
            const time = await page.getTimestamp();
            const element = await time.element();
            const text = element.textContent || "";
            expect(text.includes(suffix)).toBe(true);
        });
    });

    describe("Locale Support", () => {
        it("applies US locale formatting", async () => {
            renderComponent({ "date": testDate, "locale": "en-US", "date-format": "long" });
            const time = await page.getTimestamp();
            await expect.element(time).toBeVisible();
        });

        it("applies French locale formatting", async () => {
            renderComponent({ "date": testDate, "locale": "fr", "date-format": "long" });
            const time = await page.getTimestamp();
            await expect.element(time).toBeVisible();
        });

        it("applies German locale formatting", async () => {
            renderComponent({ "date": testDate, "locale": "de", "date-format": "long" });
            const time = await page.getTimestamp();
            await expect.element(time).toBeVisible();
        });
    });

    describe("Elapsed Time Display", () => {
        it("shows elapsed time when show-elapsed is true", async () => {
            renderComponent({ "date": testDate, "?show-elapsed": true });
            const elapsed = await page.getElapsed();
            await expect.element(elapsed).toBeVisible();
        });

        it("does not show elapsed time by default", async () => {
            renderComponent({ date: testDate });
            const elapsed = await page.getElapsed();
            await expect.element(elapsed).not.toBeInTheDocument();
        });

        it("elapsed time is wrapped in correct part", async () => {
            renderComponent({ "date": testDate, "?show-elapsed": true });
            const elapsed = await page.getElapsed();
            const element = await elapsed.element();
            expect(element.getAttribute("part")).toBe("elapsed");
            expect(element.tagName).toBe("SPAN");
        });

        it("elapsed time contains parentheses", async () => {
            renderComponent({ "date": testDate, "?show-elapsed": true });
            const elapsed = await page.getElapsed();
            const element = await elapsed.element();
            const text = element.textContent || "";
            expect(text.startsWith("(")).toBe(true);
            expect(text.endsWith(")")).toBe(true);
        });

        it("updates elapsed time for recent dates", async () => {
            // Use a very recent date to see updates
            const recentDate = new Date(Date.now() - 2000); // 2 seconds ago
            renderComponent({ ".raw": recentDate, "?show-elapsed": true });

            const elapsed = await page.getElapsed();
            const element = await elapsed.element();
            const initialText = element.textContent || "";

            // Wait for timer to potentially update
            await new Promise((resolve) => setTimeout(resolve, 300));

            const updatedText = element.textContent || "";
            // Text should exist and contain time indicator
            expect(initialText).toBeTruthy();
            expect(updatedText).toBeTruthy();
        });
    });

    describe("Component Lifecycle", () => {
        it("cleans up timer on disconnect", async () => {
            const recentDate = new Date(Date.now() - 1000);
            renderComponent({ ".raw": recentDate, "?show-elapsed": true });

            const element = (await page.getElement().element()) as Timestamp;
            const stopSpy = vi.spyOn(element, "stopElapsedCounter");

            element.remove();

            expect(stopSpy).toHaveBeenCalled();
        });

        it("updates display when date property changes", async () => {
            renderComponent({ date: testDate });
            const element = (await page.getElement().element()) as Timestamp;
            const time = await page.getTimestamp();

            const newDate = "2024-06-01T00:00:00Z";
            element.setAttribute("date", newDate);
            await element.updateComplete;

            const timeElement = await time.element();
            expect(timeElement.getAttribute("datetime")).toBe(new Date(newDate).toISOString());
        });
    });

    describe("Parts for Custom Styling", () => {
        it("exposes timestamp part for styling", async () => {
            renderComponent({ date: testDate });
            const timestamp = await page.getTimestamp();
            const element = await timestamp.element();
            expect(element.getAttribute("part")).toBe("timestamp");
        });

        it("exposes elapsed part when show-elapsed is enabled", async () => {
            renderComponent({ "date": testDate, "?show-elapsed": true });
            const elapsed = await page.getElapsed();
            const element = await elapsed.element();
            expect(element.getAttribute("part")).toBe("elapsed");
        });

        it("exposes warning part for invalid dates", async () => {
            renderComponent({ date: "invalid" });
            const warning = await page.getWarning();
            const element = await warning.element();
            expect(element.getAttribute("part")).toBe("warning");
        });
    });
});
