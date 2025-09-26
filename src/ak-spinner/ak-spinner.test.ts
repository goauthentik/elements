import "./ak-spinner.js";

import { akSpinner } from "./ak-spinner.builder.js";

import { spread } from "@open-wc/lit-helpers";
import { $, browser, expect } from "@wdio/globals";

import { html, render } from "lit";

describe("ak-spinner component", function () {
    // Clean out Lit's cache.
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-spinner")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    const renderComponent = async (properties = {}) => {
        render(html`<ak-spinner ${spread(properties)}></ak-spinner>`, document.body);
        await browser.pause(100);
        const spinner = await $("ak-spinner");
        const svg = await spinner.$(">>>svg");
        return [spinner, svg];
    };

    it("renders basic spinner", async () => {
        const [spinner, svg] = await renderComponent();

        await expect(spinner).toExist();
        await expect(svg).toExist();
        await expect(svg).toHaveAttribute("role", "progressbar");
    });

    it("sets custom label", async () => {
        // eslint-disable-next-line sonarjs/no-unused-vars
        const [_, svg] = await renderComponent({ label: "Custom loading message" });
        await expect(svg).toHaveAttribute("aria-label", "Custom loading message");
    });

    it("uses default label when not specified", async () => {
        // eslint-disable-next-line sonarjs/no-unused-vars
        const [_, svg] = await renderComponent();
        const ariaLabel = await svg.getAttribute("aria-label");

        // Should have some default label (likely "Loading...")
        expect(ariaLabel).not.toBeNull();
        expect(ariaLabel.length).toBeGreaterThan(0);
    });

    it("applies inline attribute", async () => {
        const [spinner] = await renderComponent({ "?inline": true });
        await expect(spinner).toHaveAttribute("inline");
    });

    it("exposes its CSS parts", async () => {
        const [spinner] = await renderComponent();

        const spinnerPart = await spinner.$(">>>[part='spinner']");
        const circlePart = await spinner.$(">>>[part='circle']");

        await expect(spinnerPart).toExist();
        await expect(circlePart).toExist();
        await expect((await spinnerPart.getTagName()).toLowerCase()).toBe("svg");
        await expect((await circlePart.getTagName()).toLowerCase()).toBe("circle");
    });
});

describe("akSpinner helper function", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-spinner")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    it("should create a basic spinner", async () => {
        render(akSpinner(), document.body);

        const spinner = await $("ak-spinner");
        const svg = await spinner.$(">>>svg");

        await expect(spinner).toExist();
        await expect(svg).toExist();
        await expect(svg).toHaveAttribute("role", "progressbar");
    });

    it("should create spinner with custom size", async () => {
        render(akSpinner({ size: "xl" }), document.body);

        const spinner = await $("ak-spinner");
        await expect(spinner).toHaveAttribute("size", "xl");
    });

    it("should create spinner with custom label", async () => {
        render(akSpinner({ label: "Building awesome things..." }), document.body);

        const svg = await $("ak-spinner").$(">>>svg");
        await expect(svg).toHaveAttribute("aria-label", "Building awesome things...");
    });

    it("should create inline spinner", async () => {
        render(akSpinner({ inline: true }), document.body);

        const spinner = await $("ak-spinner");
        await expect(spinner).toHaveAttribute("inline");
    });

    it("should create spinner with all options", async () => {
        render(
            akSpinner({
                size: "lg",
                label: "Processing complex data structures",
                inline: false,
            }),
            document.body
        );

        const spinner = await $("ak-spinner");
        const svg = await spinner.$(">>>svg");

        await expect(spinner).toHaveAttribute("size", "lg");
        await expect(spinner).not.toHaveAttribute("inline");
        await expect(svg).toHaveAttribute("aria-label", "Processing complex data structures");
    });

    it("should handle boolean properties correctly", async () => {
        render(akSpinner({ inline: false }), document.body);

        const spinner = await $("ak-spinner");
        await expect(spinner).not.toHaveAttribute("inline");
    });
});
