import { spread } from "@open-wc/lit-helpers";
import { $, browser, expect } from "@wdio/globals";

import { TemplateResult, html, nothing, render } from "lit";

import { akHint } from "./ak-hint.builder.js";
import "./ak-hint.js";

describe("ak-hint component", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-hint")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    const renderComponent = async (
        content: string | TemplateResult = html`<span>Test content</span>`,
        properties = {}
    ) => {
        const root = render(
            html`<ak-hint ${spread(properties)}>${content}</ak-hint>`,
            document.body
        );
        await browser.pause(100);
        return root;
    };

    it("renders basic hint with content", async () => {
        await renderComponent(html`<p>This is a test hint.</p>`);

        const hint = await $("ak-hint");
        const body = await hint.$(">>>[part='body']");

        await expect(hint).toExist();
        await expect(body).toExist();
        await expect(body).toHaveText("This is a test hint.");
    });

    it("renders hint with title slot", async () => {
        await renderComponent(html`
            <h3 slot="title">Test Title</h3>
            <p>Test body content</p>
        `);

        const hint = await $("ak-hint");
        const title = await hint.$(">>>[part='title']");
        const body = await hint.$(">>>[part='body']");

        await expect(hint).toExist();
        await expect(title).toExist();
        await expect(body).toExist();

        const titleContent = await title.$("h3");
        await expect(titleContent).toHaveText("Test Title");
    });

    it("renders hint with footer slot", async () => {
        await renderComponent(html`
            <p>Main content</p>
            <div slot="footer">Footer content</div>
        `);

        const hint = await $("ak-hint");
        const footer = await hint.$(">>>[part='footer']");

        await expect(footer).toExist();
        await expect(footer).toHaveText("Footer content");
    });

    it("renders complete hint with all slots", async () => {
        await renderComponent(html`
            <h3 slot="title">Complete Title</h3>
            <p>Main body content</p>
            <div slot="footer">Footer with <a href="#">link</a></div>
        `);

        const hint = await $("ak-hint");
        const title = await hint.$(">>>[part='title']");
        const body = await hint.$(">>>[part='body']");
        const footer = await hint.$(">>>[part='footer']");

        await expect(title).toExist();
        await expect(body).toExist();
        await expect(footer).toExist();

        const link = await footer.$("a");
        await expect(link).toExist();
    });

    it("hides empty slots", async () => {
        await renderComponent("Only body content");

        const hint = await $("ak-hint");
        const title = await hint.$(">>>[part='title']");
        const footer = await hint.$(">>>[part='footer']");

        await expect(title).not.toExist();
        await expect(footer).not.toExist();
    });

    it("exposes correct CSS parts", async () => {
        await renderComponent(html`
            <h3 slot="title">Title</h3>
            <p>Body</p>
            <div slot="footer">Footer</div>
        `);

        const hint = await $("ak-hint");
        const titlePart = await hint.$(">>>[part='title']");
        const bodyPart = await hint.$(">>>[part='body']");
        const footerPart = await hint.$(">>>[part='footer']");

        await expect(titlePart).toExist();
        await expect(bodyPart).toExist();
        await expect(footerPart).toExist();
    });

    it("applies grid layout correctly", async () => {
        await renderComponent("Test content");

        const hint = await $("ak-hint");
        const container = await hint.$("[part='hint']");

        const display = await container.getCSSProperty("display");
        expect(display.value).toBe("grid");
    });

    it("handles HTML content in slots", async () => {
        await renderComponent(html`
            <h2 slot="title">HTML <em>Title</em></h2>
            <div>
                <p>Paragraph with <strong>bold</strong> text</p>
                <ul>
                    <li>List item 1</li>
                    <li>List item 2</li>
                </ul>
            </div>
            <div slot="footer">Footer with <a href="#">link</a> and <code>code</code></div>
        `);

        const hint = await $("ak-hint");

        const titleEm = await hint.$(">>>em");
        await expect(titleEm).toHaveText("Title");

        const bodyStrong = await hint.$(">>>strong");
        await expect(bodyStrong).toHaveText("bold");

        const listItems = await hint.$$(">>>li");
        await expect(listItems).toHaveLength(2);

        const footerCode = await hint.$(">>>code");
        await expect(footerCode).toHaveText("code");
    });

    it("maintains accessibility with proper heading structure", async () => {
        await renderComponent(html`
            <h3 slot="title" id="hint-title">Important Information</h3>
            <div role="region" aria-labelledby="hint-title">
                <p>This content is labeled by the title above.</p>
            </div>
        `);

        const hint = await $("ak-hint");
        const title = await hint.$(">>>h3");
        const region = await hint.$(">>>[role='region']");

        await expect(title).toHaveAttribute("id", "hint-title");
        await expect(region).toHaveAttribute("aria-labelledby", "hint-title");
    });

    it("handles empty content gracefully", async () => {
        await renderComponent("");

        const hint = await $("ak-hint");
        const body = await hint.$(">>>[part='body']");

        await expect(hint).toExist();
        await expect(body).not.toExist();
    });

    it("supports multiple paragraphs in body", async () => {
        await renderComponent(html`
            <p>First paragraph of content.</p>
            <p>Second paragraph with more information.</p>
            <p>Third paragraph concluding the hint.</p>
        `);

        const hint = await $("ak-hint");
        const paragraphs = await hint.$$(">>>p");

        await expect(paragraphs).toHaveLength(3);
        await expect(paragraphs[0]).toHaveText("First paragraph of content.");
        await expect(paragraphs[2]).toHaveText("Third paragraph concluding the hint.");
    });
});

describe("akHint helper function", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-hint")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    it("should create a basic hint", async () => {
        render(akHint({ body: "This is a basic hint from the builder." }), document.body);

        const hint = await $("ak-hint");
        const body = await hint.$(">>>[part='body']");

        await expect(hint).toExist();
        await expect(body).toExist();
        await expect(body).toHaveText("This is a basic hint from the builder.");
    });

    it("should create hint with title", async () => {
        render(akHint({ body: "Body content", title: "Builder Title" }), document.body);

        const hint = await $("ak-hint");
        const title = await hint.$(">>>[part='title']");
        const body = await hint.$(">>>[part='body']");

        await expect(title).toExist();
        await expect(body).toExist();
        await expect(title).toHaveText("Builder Title");
        await expect(body).toHaveText("Body content");
    });

    it("should create hint with footer", async () => {
        render(akHint({ body: "Body content", footer: "Builder footer" }), document.body);

        const hint = await $("ak-hint");
        const footer = await hint.$(">>>[part='footer']");

        await expect(footer).toExist();
        await expect(footer).toHaveText("Builder footer");
    });

    it("should create hint with all options", async () => {
        render(
            akHint({
                body: "Complete body content",
                title: "Complete Title",
                footer: "Complete footer with details",
            }),
            document.body
        );

        const hint = await $("ak-hint");
        const title = await hint.$(">>>[part='title']");
        const body = await hint.$(">>>[part='body']");
        const footer = await hint.$(">>>[part='footer']");

        await expect(title).toExist();
        await expect(body).toExist();
        await expect(footer).toExist();

        await expect(title).toHaveText("Complete Title");
        await expect(body).toHaveText("Complete body content");
        await expect(footer).toHaveText("Complete footer with details");
    });

    it("should handle template content", async () => {
        render(
            akHint({
                body: html`<p>HTML <strong>content</strong> in body</p>`,
                title: html`<h3>HTML Title</h3>`,
                footer: html`<div>Footer with <a href="#">link</a></div>`,
            }),
            document.body
        );

        const hint = await $("ak-hint");

        const titleH3 = await hint.$(">>>h3");
        await expect(titleH3).toHaveText("HTML Title");

        const bodyStrong = await hint.$(">>>strong");
        await expect(bodyStrong).toHaveText("content");

        const footerLink = await hint.$(">>>a");
        await expect(footerLink).toExist();
    });

    it("should handle empty content", async () => {
        render(akHint(), document.body);

        const hint = await $("ak-hint");
        await expect(hint).toExist();
    });

    it("should maintain component functionality", async () => {
        render(akHint({ body: "Test content", title: "Test" }), document.body);

        const hint = await $("ak-hint");
        const container = await hint.$("[part='hint']");

        const display = await container.getCSSProperty("display");
        expect(display.value).toBe("grid");
    });
});
