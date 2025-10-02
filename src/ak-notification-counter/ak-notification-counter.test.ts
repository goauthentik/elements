import "./ak-notification-counter.js";

import { akNotificationCounter } from "./ak-notification-counter.builder.js";

import { spread } from "@open-wc/lit-helpers";
import { $, browser, expect } from "@wdio/globals";

import { html, render } from "lit";

describe("ak-notification-counter component", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            document.body.querySelector("ak-notification-counter")?.remove();
            if ("_$litPart$" in document.body) {
                delete document.body._$litPart$;
            }
        });
    });

    const renderComponent = async (properties = {}) => {
        const root = render(html`<ak-notification-counter ${spread(properties)}></ak-notification-counter>`, document.body);
        await browser.pause(100);
        return root;
    };

    it("renders with basic attributes", async () => {
        await renderComponent({
            src: "/test-logo.svg",
            alt: "Test Logo",
        });

        const notification-counterEl = $("ak-notification-counter");
        const img = notification-counterEl.$(">>>img");

        await expect(notification-counterEl).toExist();
        await expect(img).toExist();
        await expect(img).toHaveAttribute("src", "/test-logo.svg");
        await expect(img).toHaveAttribute("alt", "Test Logo");
    });

    it("applies loading attribute correctly", async () => {
        await renderComponent({
            src: "/test-logo.svg",
            alt: "Test Logo",
        });

        const img = $("ak-notification-counter").$(">>>img");
        await expect(img).toHaveAttribute("loading", "lazy");
    });

    it("reflects src and alt properties as attributes", async () => {
        await renderComponent({
            src: "/reflected-logo.svg",
            alt: "Reflected Logo",
        });

        const notification-counterEl = $("ak-notification-counter");
        await expect(notification-counterEl).toHaveAttribute("src", "/reflected-logo.svg");
        await expect(notification-counterEl).toHaveAttribute("alt", "Reflected Logo");
    });

    it("handles missing src attribute", async () => {
        await renderComponent({
            alt: "Logo without source",
        });

        const img = $("ak-notification-counter").$(">>>img");
        await expect(img).toExist();
        await expect(img).toHaveAttribute("alt", "Logo without source");
        // src attribute should not be present when not provided
        const hasSrc = await img.getAttribute("src");
        expect(hasSrc).toBeNull();
    });

    it("handles missing alt attribute", async () => {
        await renderComponent({
            src: "/logo-no-alt.svg",
        });

        const img = $("ak-notification-counter").$(">>>img");
        await expect(img).toExist();
        await expect(img).toHaveAttribute("src", "/logo-no-alt.svg");
        // alt attribute should not be present when not provided
        const hasAlt = await img.getAttribute("alt");
        expect(hasAlt).toBeNull();
    });

    it("exposes correct CSS part", async () => {
        await renderComponent({
            src: "/test-logo.svg",
            alt: "Test Logo",
        });

        const notification-counterPart = $("ak-notification-counter").$('>>>[part="notification-counter"]');
        await expect(notification-counterPart).toExist();
        await expect((await notification-counterPart.getTagName()).toLowerCase()).toBe("img");
    });

    it("updates attributes when properties change", async () => {
        await renderComponent({
            src: "/initial-logo.svg",
            alt: "Initial Logo",
        });

        const notification-counterEl = $("ak-notification-counter");
        const img = notification-counterEl.$(">>>img");

        // Verify initial state
        await expect(img).toHaveAttribute("src", "/initial-logo.svg");
        await expect(img).toHaveAttribute("alt", "Initial Logo");

        // Update properties
        await notification-counterEl.execute((elem) => {
            elem.setAttribute("src", "/updated-logo.svg");
            elem.setAttribute("alt", "Updated Logo");
        });

        await browser.pause(50);

        // Verify updated state
        await expect(img).toHaveAttribute("src", "/updated-logo.svg");
        await expect(img).toHaveAttribute("alt", "Updated Logo");
    });

    it("applies responsive CSS custom properties", async () => {
        await browser.execute(() => {
            const style = document.createElement("style");
            style.textContent = `
                .responsive-test {
                    --pf-v5-c-notification-counter--Width: 100px;
                    --pf-v5-c-notification-counter--Height: 50px;
                }
            `;
            document.head.appendChild(style);
        });

        await renderComponent({
            src: "/responsive-logo.svg",
            alt: "Responsive Logo",
            class: "responsive-test",
        });

        const notification-counterEl = $("ak-notification-counter");
        const computedStyle = await notification-counterEl.getCSSProperty("width");
        const heightStyle = await notification-counterEl.getCSSProperty("height");

        // Note: These values might be computed differently depending on browser/environment
        expect(computedStyle.value).toContain("100px");
        expect(heightStyle.value).toContain("50px");
    });

    it("maintains aspect ratio with object-fit", async () => {
        await renderComponent({
            src: "/test-logo.svg",
            alt: "Aspect Ratio Test",
        });

        const img = $("ak-notification-counter").$(">>>img");
        const objectFit = await img.getCSSProperty("object-fit");

        expect(objectFit.value).toBe("contain");
    });
});

describe("akNotificationCounter helper function", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            document.body.querySelector("ak-notification-counter")?.remove();
            if ("_$litPart$" in document.body) {
                delete document.body._$litPart$;
            }
        });
    });

    it("should create a basic notification-counter component", async () => {
        render(
            akNotificationCounter({
                src: "/builder-logo.svg",
                alt: "Builder Logo",
            }),
            document.body,
        );

        const notification-counterEl = $("ak-notification-counter");
        const img = notification-counterEl.$(">>>img");

        await expect(notification-counterEl).toExist();
        await expect(img).toHaveAttribute("src", "/builder-logo.svg");
        await expect(img).toHaveAttribute("alt", "Builder Logo");
    });

    it("should create notification-counter with only src", async () => {
        render(
            akNotificationCounter({
                src: "/logo-only.svg",
            }),
            document.body,
        );

        const notification-counterEl = $("ak-notification-counter");
        const img = notification-counterEl.$(">>>img");

        await expect(notification-counterEl).toExist();
        await expect(img).toHaveAttribute("src", "/logo-only.svg");

        // alt should not be present
        const hasAlt = await img.getAttribute("alt");
        expect(hasAlt).toBeNull();
    });

    it("should create notification-counter with only alt", async () => {
        render(
            akNotificationCounter({
                alt: "Logo description only",
            }),
            document.body,
        );

        const notification-counterEl = $("ak-notification-counter");
        const img = notification-counterEl.$(">>>img");

        await expect(notification-counterEl).toExist();
        await expect(img).toHaveAttribute("alt", "Logo description only");

        // src should not be present
        const hasSrc = await img.getAttribute("src");
        expect(hasSrc).toBeNull();
    });

    it("should create empty notification-counter when no options provided", async () => {
        render(akNotificationCounter({}), document.body);

        const notification-counterEl = $("ak-notification-counter");
        const img = notification-counterEl.$(">>>img");

        await expect(notification-counterEl).toExist();
        await expect(img).toExist();

        // Neither attribute should be present
        const hasSrc = await img.getAttribute("src");
        const hasAlt = await img.getAttribute("alt");
        expect(hasSrc).toBeNull();
        expect(hasAlt).toBeNull();
    });

    it("should create notification-counter with undefined options", async () => {
        render(akNotificationCounter(), document.body);

        const notification-counterEl = $("ak-notification-counter");
        const img = notification-counterEl.$(">>>img");

        await expect(notification-counterEl).toExist();
        await expect(img).toExist();
    });

    it("should properly reflect attributes to component", async () => {
        render(
            akNotificationCounter({
                src: "/reflected-test.svg",
                alt: "Reflection Test",
            }),
            document.body,
        );

        const notification-counterEl = $("ak-notification-counter");

        // Check that attributes are reflected on the component
        await expect(notification-counterEl).toHaveAttribute("src", "/reflected-test.svg");
        await expect(notification-counterEl).toHaveAttribute("alt", "Reflection Test");
    });

    it("should handle special characters in attributes", async () => {
        const specialAlt = "Logo with special chars: & < > \" ' #";

        render(
            akNotificationCounter({
                src: "/special-chars.svg",
                alt: specialAlt,
            }),
            document.body,
        );

        const img = $("ak-notification-counter").$(">>>img");

        await expect(img).toHaveAttribute("src", "/special-chars.svg");
        await expect(img).toHaveAttribute("alt", specialAlt);
    });

    it("should maintain component functionality", async () => {
        render(
            akNotificationCounter({
                src: "/functional-test.svg",
                alt: "Functional Test Logo",
            }),
            document.body,
        );

        const notification-counterEl = $("ak-notification-counter");
        const img = notification-counterEl.$(">>>img");
        const notification-counterPart = notification-counterEl.$(">>>[part='notification-counter']");

        // Verify all expected functionality
        await expect(img).toHaveAttribute("loading", "lazy");
        await expect(notification-counterPart).toExist();

        const objectFit = await img.getCSSProperty("object-fit");
        expect(objectFit.value).toBe("contain");
    });
});
