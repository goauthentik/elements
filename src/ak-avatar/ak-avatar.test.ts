import "./ak-avatar.js";

import { akAvatar } from "./ak-avatar.builder.js";

import { spread } from "@open-wc/lit-helpers";
import { $, browser, expect } from "@wdio/globals";

import { html, render } from "lit";

describe("ak-avatar component", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            document.body.querySelector("ak-avatar")?.remove();
            if ("_$litPart$" in document.body) {
                delete document.body._$litPart$;
            }
        });
    });

    const renderComponent = async (properties = {}) => {
        const root = render(html`<ak-avatar ${spread(properties)}></ak-avatar>`, document.body);
        await browser.pause(100);
        return root;
    };

    it("renders with basic attributes", async () => {
        await renderComponent({
            src: "/test-logo.svg",
            alt: "Test Logo",
        });

        const avatarEl = $("ak-avatar");
        const img = avatarEl.$(">>>img");

        await expect(avatarEl).toExist();
        await expect(img).toExist();
        await expect(img).toHaveAttribute("src", "/test-logo.svg");
        await expect(img).toHaveAttribute("alt", "Test Logo");
    });

    it("applies loading attribute correctly", async () => {
        await renderComponent({
            src: "/test-logo.svg",
            alt: "Test Logo",
        });

        const img = $("ak-avatar").$(">>>img");
        await expect(img).toHaveAttribute("loading", "lazy");
    });

    it("reflects src and alt properties as attributes", async () => {
        await renderComponent({
            src: "/reflected-logo.svg",
            alt: "Reflected Logo",
        });

        const avatarEl = $("ak-avatar");
        await expect(avatarEl).toHaveAttribute("src", "/reflected-logo.svg");
        await expect(avatarEl).toHaveAttribute("alt", "Reflected Logo");
    });

    it("handles missing src attribute", async () => {
        await renderComponent({
            alt: "Logo without source",
        });

        const img = $("ak-avatar").$(">>>img");
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

        const img = $("ak-avatar").$(">>>img");
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

        const avatarPart = $("ak-avatar").$('>>>[part="avatar"]');
        await expect(avatarPart).toExist();
        await expect((await avatarPart.getTagName()).toLowerCase()).toBe("img");
    });

    it("updates attributes when properties change", async () => {
        await renderComponent({
            src: "/initial-logo.svg",
            alt: "Initial Logo",
        });

        const avatarEl = $("ak-avatar");
        const img = avatarEl.$(">>>img");

        // Verify initial state
        await expect(img).toHaveAttribute("src", "/initial-logo.svg");
        await expect(img).toHaveAttribute("alt", "Initial Logo");

        // Update properties
        await avatarEl.execute((elem) => {
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
                    --pf-v5-c-avatar--Width: 100px;
                    --pf-v5-c-avatar--Height: 50px;
                }
            `;
            document.head.appendChild(style);
        });

        await renderComponent({
            src: "/responsive-logo.svg",
            alt: "Responsive Logo",
            class: "responsive-test",
        });

        const avatarEl = $("ak-avatar");
        const computedStyle = await avatarEl.getCSSProperty("width");
        const heightStyle = await avatarEl.getCSSProperty("height");

        // Note: These values might be computed differently depending on browser/environment
        expect(computedStyle.value).toContain("100px");
        expect(heightStyle.value).toContain("50px");
    });

    it("maintains aspect ratio with object-fit", async () => {
        await renderComponent({
            src: "/test-logo.svg",
            alt: "Aspect Ratio Test",
        });

        const img = $("ak-avatar").$(">>>img");
        const objectFit = await img.getCSSProperty("object-fit");

        expect(objectFit.value).toBe("contain");
    });
});

describe("akAvatar helper function", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            document.body.querySelector("ak-avatar")?.remove();
            if ("_$litPart$" in document.body) {
                delete document.body._$litPart$;
            }
        });
    });

    it("should create a basic avatar component", async () => {
        render(
            akAvatar({
                src: "/builder-logo.svg",
                alt: "Builder Logo",
            }),
            document.body,
        );

        const avatarEl = $("ak-avatar");
        const img = avatarEl.$(">>>img");

        await expect(avatarEl).toExist();
        await expect(img).toHaveAttribute("src", "/builder-logo.svg");
        await expect(img).toHaveAttribute("alt", "Builder Logo");
    });

    it("should create avatar with only src", async () => {
        render(
            akAvatar({
                src: "/logo-only.svg",
            }),
            document.body,
        );

        const avatarEl = $("ak-avatar");
        const img = avatarEl.$(">>>img");

        await expect(avatarEl).toExist();
        await expect(img).toHaveAttribute("src", "/logo-only.svg");

        // alt should not be present
        const hasAlt = await img.getAttribute("alt");
        expect(hasAlt).toBeNull();
    });

    it("should create avatar with only alt", async () => {
        render(
            akAvatar({
                alt: "Logo description only",
            }),
            document.body,
        );

        const avatarEl = $("ak-avatar");
        const img = avatarEl.$(">>>img");

        await expect(avatarEl).toExist();
        await expect(img).toHaveAttribute("alt", "Logo description only");

        // src should not be present
        const hasSrc = await img.getAttribute("src");
        expect(hasSrc).toBeNull();
    });

    it("should create empty avatar when no options provided", async () => {
        render(akAvatar({}), document.body);

        const avatarEl = $("ak-avatar");
        const img = avatarEl.$(">>>img");

        await expect(avatarEl).toExist();
        await expect(img).toExist();

        // Neither attribute should be present
        const hasSrc = await img.getAttribute("src");
        const hasAlt = await img.getAttribute("alt");
        expect(hasSrc).toBeNull();
        expect(hasAlt).toBeNull();
    });

    it("should create avatar with undefined options", async () => {
        render(akAvatar(), document.body);

        const avatarEl = $("ak-avatar");
        const img = avatarEl.$(">>>img");

        await expect(avatarEl).toExist();
        await expect(img).toExist();
    });

    it("should properly reflect attributes to component", async () => {
        render(
            akAvatar({
                src: "/reflected-test.svg",
                alt: "Reflection Test",
            }),
            document.body,
        );

        const avatarEl = $("ak-avatar");

        // Check that attributes are reflected on the component
        await expect(avatarEl).toHaveAttribute("src", "/reflected-test.svg");
        await expect(avatarEl).toHaveAttribute("alt", "Reflection Test");
    });

    it("should handle special characters in attributes", async () => {
        const specialAlt = "Logo with special chars: & < > \" ' #";

        render(
            akAvatar({
                src: "/special-chars.svg",
                alt: specialAlt,
            }),
            document.body,
        );

        const img = $("ak-avatar").$(">>>img");

        await expect(img).toHaveAttribute("src", "/special-chars.svg");
        await expect(img).toHaveAttribute("alt", specialAlt);
    });

    it("should maintain component functionality", async () => {
        render(
            akAvatar({
                src: "/functional-test.svg",
                alt: "Functional Test Logo",
            }),
            document.body,
        );

        const avatarEl = $("ak-avatar");
        const img = avatarEl.$(">>>img");
        const avatarPart = avatarEl.$(">>>[part='avatar']");

        // Verify all expected functionality
        await expect(img).toHaveAttribute("loading", "lazy");
        await expect(avatarPart).toExist();

        const objectFit = await img.getCSSProperty("object-fit");
        expect(objectFit.value).toBe("contain");
    });
});
