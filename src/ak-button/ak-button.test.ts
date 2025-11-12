import "./ak-button.js";

import { spread } from "@open-wc/lit-helpers";
import { $, browser, expect } from "@wdio/globals";

import { html, render, TemplateResult } from "lit";

describe("ak-button component", () => {
    let _container: WebdriverIO.Element;

    beforeEach(async () => {
        document.body.innerHTML = `<div id="container"></div>`;
        // @ts-expect-error It's mistyping this badly.
        _container = await $("#container");
    });

    afterEach(async () => {
        await browser.execute(async () => {
            document.body.innerHTML = "";
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    const renderComponent = async (
        content: string | TemplateResult = "Click me",
        properties = {},
    ) => {
        const root = render(
            html`<ak-button ${spread(properties)}>${content}</ak-button>`,
            document.body,
        );
        await browser.pause(100);
        return root;
    };

    it("renders as a button by default", async () => {
        await renderComponent("Click here");
        const button = await $("ak-button").$(">>>button");
        await expect(button).toExist();
        await expect(button).toHaveText("Click here");
    });

    it("renders as a link when specified", async () => {
        await renderComponent("Click to leave", {
            variant: "link",
            href: "https://example.com",
        });
        const link = await $("ak-button").$(">>>a");
        await expect(link).toExist();
        await expect(link).toHaveText("Click to leave");
        await expect(link).toHaveAttr("href", "https://example.com");
    });

    it("applies primary variant styles by default", async () => {
        await renderComponent("Click me", { variant: "primary" });
        const button = await $("ak-button").$(">>>button");
        expect(button).toHaveElementClass("primary");
    });

    it("applies severity styles when specified", async () => {
        await renderComponent("Click me", { severity: "danger" });
        const button = await $("ak-button").$(">>>button");
        expect(button).toHaveElementClass("danger");
    });

    it("applies disabled state when specified", async () => {
        await renderComponent("Click me", { "?disabled": true });
        const button = await $("ak-button").$(">>>button");
        expect(button).toBeDisabled();
    });

    it("triggers click events", async () => {
        await renderComponent("Click me");

        // Setup a click listener
        const setUp = await browser.execute(() => {
            // @ts-expect-error Mangling window again.
            window.buttonClicked = false;
            const button = document.querySelector("ak-button");
            if (!button) {
                return false;
            }
            button.addEventListener("click", () => {
                // @ts-expect-error Mangling window again.
                window.buttonClicked = true;
            });
            return true;
        });

        expect(setUp).toEqual(true);

        const button = await $("ak-button");
        await button.click();
        await browser.pause(50);

        // Check if the event was triggered
        const wasClicked = await browser.execute(() => {
            // @ts-expect-error Mangling window again.
            return window.buttonClicked;
        });
        expect(wasClicked).toEqual(true);

        // @ts-expect-error Cleaning up after ourselves.
        delete window.buttonClicked;
    });

    it("disabled buttons do not trigger click events", async () => {
        await renderComponent("Click me", { "?disabled": true });

        // Setup a click listener
        const setUp = await browser.execute(() => {
            // @ts-expect-error Mangling window again.
            window.buttonClicked = false;
            const button = document.querySelector("ak-button");
            if (!button) {
                return false;
            }
            button.addEventListener("click", () => {
                // @ts-expect-error Mangling window again.
                window.buttonClicked = true;
            });
            return true;
        });

        expect(setUp).toEqual(true);

        const button = await $("ak-button");
        await button.click();
        await browser.pause(50);

        // Check if the event was triggered
        const wasClicked = await browser.execute(() => {
            // @ts-expect-error Mangling window again.
            return window.buttonClicked;
        });
        expect(wasClicked).toEqual(false);

        // @ts-expect-error Cleaning up after ourselves.
        delete window.buttonClicked;
    });
});
