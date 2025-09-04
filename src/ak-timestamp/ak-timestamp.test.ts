import "./ak-timestamp.js";

import { spread } from "@open-wc/lit-helpers";
import { $, browser, expect } from "@wdio/globals";

import { html, render } from "lit";

describe("ak-timestamp component", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-timestamp")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    const renderComponent = async (properties = {}) => {
        const root = render(
            html`<ak-timestamp ${spread(properties)}></ak-timestamp>`,
            document.body,
        );
        await browser.pause(100);
        return root;
    };

    it("renders the current time by default", async () => {
        await renderComponent();
        const timestamp = await $("ak-timestamp");
        await expect(timestamp).toExist();

        const timeElement = await timestamp.$(">>>time");
        await expect(timeElement).toExist();

        // Get the datetime attribute which should be a valid ISO string
        const datetimeAttr = await timeElement.getAttribute("datetime");
        expect(new Date(datetimeAttr).toString()).not.toBe("Invalid Date");
    });

    it("renders a specified date string", async () => {
        const testDate = "2023-01-15T12:30:00Z";
        await renderComponent({ date: testDate });

        const timeElement = await $("ak-timestamp").$(">>>time");
        const datetimeAttr = await timeElement.getAttribute("datetime");
        expect(datetimeAttr).toBe(new Date(testDate).toISOString());
    });

    it("renders a specified date object", async () => {
        const testDate = new Date("2023-01-15T12:30:00Z");
        await renderComponent({ ".raw": testDate });

        const timeElement = await $("ak-timestamp").$(">>>time");
        const datetimeAttr = await timeElement.getAttribute("datetime");
        expect(datetimeAttr).toBe(testDate.toISOString());
    });

    it("renders a specified timestamp number", async () => {
        const testTimestamp = 1673784600000; // 2023-01-15T12:30:00Z in milliseconds
        await renderComponent({ date: testTimestamp });
        const timeElement = await $("ak-timestamp").$(">>>time");
        const datetimeAttr = await timeElement.getAttribute("datetime");
        expect(datetimeAttr).toBe(new Date(testTimestamp).toISOString());
    });

    it("renders a warning for invalid dates", async () => {
        await renderComponent({ date: "not-a-date" });

        const warningElement = await $("ak-timestamp").$('>>>[part="warning"]');
        await expect(warningElement).toExist();
        await expect(warningElement).toHaveText("Failed to parse time");
    });

    it("applies date format correctly", async () => {
        // Create a specific test date
        const testDate = "2023-01-15T12:30:00Z";

        // Set date format to "short" and render
        await renderComponent({ "date": testDate, "date-format": "short" });

        // Get formatted time string from component
        const shortTimeElement = await $("ak-timestamp").$(">>>time");
        const shortTimeText = await shortTimeElement.getText();

        // Now render with "long" format
        await renderComponent({ "date": testDate, "date-format": "long" });

        const longTimeElement = await $("ak-timestamp").$(">>>time");
        const longTimeText = await longTimeElement.getText();

        // The two formats should be different
        expect(shortTimeText).not.toEqual(longTimeText);

        // Short format should be shorter than long format
        expect(shortTimeText.length).toBeLessThan(longTimeText.length);
    });

    it("applies time format correctly", async () => {
        const testDate = "2023-01-15T12:30:00Z";

        // Set time format to "short" and render
        await renderComponent({ "date": testDate, "time-format": "short" });

        // Get formatted time string from component
        const shortTimeElement = await $("ak-timestamp").$(">>>time");
        const shortTimeText = await shortTimeElement.getText();

        // Now render with "full" format
        await renderComponent({ "date": testDate, "time-format": "full" });

        const fullTimeElement = await $("ak-timestamp").$(">>>time");
        const fullTimeText = await fullTimeElement.getText();

        // The two formats should be different
        expect(shortTimeText).not.toEqual(fullTimeText);

        // Short format should be shorter than full format
        expect(shortTimeText.length).toBeLessThan(fullTimeText.length);
    });

    it("displays UTC time when specified", async () => {
        const testDate = "2023-01-15T12:30:00Z";

        // Render with UTC flag
        await renderComponent({ "date": testDate, "?display-utc": true });
        const utcTimeElement = await $("ak-timestamp").$(">>>time");
        const utcTimeText = await utcTimeElement.getText();

        // UTC time should be different from local time
        // and should include "utc" suffix
        expect(utcTimeText.toLowerCase()).toContain("utc");

        // Check that full UTC format includes "Coordinated Universal Time"
        await renderComponent({
            "date": testDate,
            "should-display-utc": true,
            "time-format": "full",
        });

        const fullUtcElement = await $("ak-timestamp").$(">>>time");
        const fullUtcText = await fullUtcElement.getText();
        expect(fullUtcText).toContain("Coordinated Universal Time");
    });

    it("applies display suffix when provided", async () => {
        const testDate = "2023-01-15T12:30:00Z";
        const suffix = "EDT";

        await renderComponent({ "date": testDate, "display-suffix": suffix });

        const timeElement = await $("ak-timestamp").$(">>>time");
        const timeText = await timeElement.getText();

        // Check that the suffix is in the displayed time
        expect(timeText).toContain(suffix);
    });

    it("applies custom display suffix with UTC", async () => {
        const testDate = "2023-01-15T12:30:00Z";
        const suffix = "Greenwich Mean Time";

        await renderComponent({
            "date": testDate,
            "?should-display-utc": true,
            "display-suffix": suffix,
        });

        const timeElement = await $("ak-timestamp").$(">>>time");
        const timeText = await timeElement.getText();

        // Check that the custom suffix is used instead of the default UTC suffix
        expect(timeText).toContain(suffix);
        expect(timeText).not.toContain("utc");
    });

    it("respects 12-hour format setting", async () => {
        // Set up a date with a specific hour to test 12/24 hour format
        const testDate = "2023-01-15T15:30:00Z"; // 3:30 PM

        // Force 12-hour format
        await renderComponent({
            "date": testDate,
            "?is-12-hour": true,
        });

        const timeElement12hr = await $("ak-timestamp").$(">>>time");
        const timeText12hr = await timeElement12hr.getText();

        // Force 24-hour format by setting is-12-hour to false
        await renderComponent({
            "date": testDate,
            "?is-12-hour": false,
        });

        const timeElement24hr = await $("ak-timestamp").$(">>>time");
        const timeText24hr = await timeElement24hr.getText();

        // 12-hour format should contain AM/PM indicator
        const has12HourIndicator = /am|pm/i.test(timeText12hr);
        expect(has12HourIndicator).toBe(true);

        // 24-hour format should not contain AM/PM indicator
        const has24HourIndicator = /am|pm/i.test(timeText24hr);
        expect(has24HourIndicator).toBe(false);
    });

    it("respects custom locale setting", async () => {
        const testDate = "2023-01-15T12:30:00Z";

        // Test with US English locale
        await renderComponent({
            date: testDate,
            locale: "en-US",
        });

        const timeElementUS = await $("ak-timestamp").$(">>>time");
        const timeTextUS = await timeElementUS.getText();

        // Test with French locale
        await renderComponent({
            date: testDate,
            locale: "fr-FR",
        });

        const timeElementFR = await $("ak-timestamp").$(">>>time");
        const timeTextFR = await timeElementFR.getText();

        // The formatted dates should be different between locales
        expect(timeTextUS).not.toEqual(timeTextFR);
    });

    it("handles dynamic date updates", async () => {
        // Initial render with one date
        const initialDate = "2023-01-15T12:30:00Z";
        await renderComponent({ date: initialDate });

        const initialTimeElement = await $("ak-timestamp").$(">>>time");
        const initialDatetime = await initialTimeElement.getAttribute("datetime");

        // Update the date property
        const newDate = "2023-05-20T18:45:00Z";
        await browser.execute((newDateValue) => {
            const timestamp = document.querySelector("ak-timestamp");
            if (timestamp) {
                timestamp.date = newDateValue;
            }
        }, newDate);

        // Wait for update
        await browser.pause(100);

        // Check if the datetime attribute was updated
        const updatedTimeElement = await $("ak-timestamp").$(">>>time");
        const updatedDatetime = await updatedTimeElement.getAttribute("datetime");

        expect(updatedDatetime).not.toEqual(initialDatetime);
        expect(updatedDatetime).toEqual(new Date(newDate).toISOString());
    });

    it("renders the time element with proper attributes", async () => {
        const testDate = "2023-01-15T12:30:00Z";
        await renderComponent({ date: testDate });

        const timeElement = await $("ak-timestamp").$(">>>time");

        // Check the time element has the correct part attribute
        await expect(timeElement).toHaveAttribute("part", "timestamp");

        // Check datetime attribute is an ISO string
        const datetimeAttr = await timeElement.getAttribute("datetime");
        expect(datetimeAttr).toBe(new Date(testDate).toISOString());
    });
});
