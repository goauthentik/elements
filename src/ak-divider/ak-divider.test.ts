import "./ak-divider.js";

import { akDivider } from "./ak-divider.js";

import { $, browser, expect } from "@wdio/globals";

import { html, nothing, render, TemplateResult } from "lit";

type Renderable = TemplateResult | string | typeof nothing;

describe("ak-divider component", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-divider")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    const renderDivider = async (message: Renderable = "") => {
        await render(html`<ak-divider>${message}</ak-divider>`, document.body);
        return await $("ak-divider");
    };

    it("should render the divider", async () => {
        const divider = await renderDivider();
        await expect(divider).toExist();
    });

    it("should render the divider with the specified text", async () => {
        const divider = await renderDivider(html`<span>Your Message Here</span>`);
        const span = await divider.$(">>>span");
        await expect(span).toExist();
        await expect(span).toHaveText("Your Message Here");
    });

    it("should render the divider as a function with the specified text", async () => {
        await render(akDivider("Your Message As A Function"), document.body);
        const divider = $("ak-divider");
        await expect(divider).toExist();
        await expect(await divider.$(">>>span")).toHaveText("Your Message As A Function");
    });

    it("should render the divider as a function", async () => {
        await renderDivider(akDivider());
        const divider = $("ak-divider");
        await expect(divider).toExist();
    });
});
