import "./ak-hint.js";

import { akHint } from "./ak-hint.builder.js";

import { spread } from "@open-wc/lit-helpers";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-lit";
import { Locator, locators, page } from "vitest/browser";

import { html, type TemplateResult } from "lit";

locators.extend({
    getHint() {
        return "ak-hint";
    },
    getHintContainer() {
        return 'ak-hint >> [part="hint"]';
    },
    getTitle() {
        return 'ak-hint >> [part="title"]';
    },
    getBody() {
        return 'ak-hint >> [part="body"]';
    },
    getFooter() {
        return 'ak-hint >> [part="footer"]';
    },
});

declare module "vitest/browser" {
    interface LocatorSelectors {
        getHint(): Locator;
        getHintContainer(): Locator;
        getTitle(): Locator;
        getBody(): Locator;
        getFooter(): Locator;
    }
}

describe("ak-hint component", () => {
    const renderComponent = (content: string | TemplateResult = "", properties = {}) => {
        return render(html`<ak-hint ${spread(properties)}>${content}</ak-hint>`);
    };

    it("renders basic hint with content", async () => {
        renderComponent(html`<p>This is a test hint.</p>`);

        const hint = page.getHint();
        const body = page.getBody();

        await expect.element(hint).toBeInTheDocument();
        await expect.element(body).toBeInTheDocument();
        await expect.element(hint).toHaveTextContent("This is a test hint.");
    });

    it("renders hint with title slot", async () => {
        renderComponent(html`
            <h3 slot="title">Test Title</h3>
            <p>Test body content</p>
        `);

        const hint = page.getHint();
        const title = page.getTitle();
        const body = page.getBody();

        await expect.element(hint).toBeInTheDocument();
        await expect.element(title).toBeInTheDocument();
        await expect.element(body).toBeInTheDocument();
        await expect.element(hint).toHaveTextContent("Test Title");
    });

    it("renders hint with footer slot", async () => {
        renderComponent(html`
            <p>Main content</p>
            <div slot="footer">Footer content</div>
        `);

        const hint = page.getHint();
        const footer = page.getFooter();

        await expect.element(hint).toBeInTheDocument();
        await expect.element(footer).toBeInTheDocument();
        await expect.element(hint).toHaveTextContent("Footer content");
    });

    it("renders complete hint with all slots", async () => {
        renderComponent(html`
            <h3 slot="title">Complete Title</h3>
            <p>Main body content</p>
            <div slot="footer">Footer with <a href="#">link</a></div>
        `);

        const title = page.getTitle();
        const body = page.getBody();
        const footer = page.getFooter();

        await expect.element(title).toBeInTheDocument();
        await expect.element(body).toBeInTheDocument();
        await expect.element(footer).toBeInTheDocument();
    });

    it("hides empty slots", async () => {
        renderComponent(html`<span>Only body content</span>`);

        const hint = page.getHint();
        const title = page.getTitle();
        const footer = page.getFooter();

        await expect.element(hint).toBeInTheDocument();
        await expect.element(title).not.toBeInTheDocument();
        await expect.element(footer).not.toBeInTheDocument();
    });

    it("exposes correct CSS parts", async () => {
        renderComponent(html`
            <h3 slot="title">Title</h3>
            <p>Body</p>
            <div slot="footer">Footer</div>
        `);

        const component = await page.getHint().element();
        const shadowRoot = component.shadowRoot!;

        const hintPart = shadowRoot.querySelector('[part="hint"]');
        const titlePart = shadowRoot.querySelector('[part="title"]');
        const bodyPart = shadowRoot.querySelector('[part="body"]');
        const footerPart = shadowRoot.querySelector('[part="footer"]');

        expect(hintPart).not.toBeNull();
        expect(titlePart).not.toBeNull();
        expect(bodyPart).not.toBeNull();
        expect(footerPart).not.toBeNull();
    });

    it("applies grid layout correctly", async () => {
        renderComponent(html`<span>Test content</span>`);

        const container = page.getHintContainer();
        await expect.element(container).toBeInTheDocument();

        const element = await container.element();
        const style = window.getComputedStyle(element);
        expect(style.display).toBe("grid");
    });

    it("handles HTML content in slots", async () => {
        renderComponent(html`
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

        const hint = page.getHint();
        await expect.element(hint).toBeInTheDocument();

        const component = await hint.element();
        const title = page.getTitle();
        const body = page.getBody();
        const footer = page.getFooter();

        // Verify nested elements are present
        expect(component.querySelector("em")).not.toBeNull();
        expect(component.querySelector("strong")).not.toBeNull();
        expect(component.querySelectorAll("li")).toHaveLength(2);
        expect(component.querySelector("code")).not.toBeNull();
    });

    it("maintains accessibility with role attribute", async () => {
        renderComponent(html`<p>Accessible hint content</p>`);

        const hint = page.getHint();
        await expect.element(hint).toHaveAttribute("role", "note");
    });

    it("preserves custom role when provided", async () => {
        renderComponent(html`<p>Accessible hint content</p>`, { role: "status" });

        const hint = page.getHint();
        await expect.element(hint).toHaveAttribute("role", "status");
    });

    it("handles empty content gracefully", async () => {
        renderComponent("");

        const hint = page.getHint();
        const body = page.getBody();

        await expect.element(hint).toBeInTheDocument();
        await expect.element(body).not.toBeInTheDocument();
    });

    it("supports multiple paragraphs in body", async () => {
        renderComponent(html`
            <p>First paragraph of content.</p>
            <p>Second paragraph with more information.</p>
            <p>Third paragraph concluding the hint.</p>
        `);

        const hint = page.getHint();
        const component = await hint.element();
        const paragraphs = component.querySelectorAll("p");

        expect(paragraphs).toHaveLength(3);
        expect(paragraphs[0].textContent).toBe("First paragraph of content.");
        expect(paragraphs[2].textContent).toBe("Third paragraph concluding the hint.");
    });

    it("applies variant attribute for success styling", async () => {
        renderComponent(html`<p>Success message</p>`, { variant: "success" });

        const hint = page.getHint();
        await expect.element(hint).toHaveAttribute("variant", "success");
    });

    it("applies variant attribute for warning styling", async () => {
        renderComponent(html`<p>Warning message</p>`, { variant: "warning" });

        const hint = page.getHint();
        await expect.element(hint).toHaveAttribute("variant", "warning");
    });

    it("applies variant attribute for danger styling", async () => {
        renderComponent(html`<p>Danger message</p>`, { variant: "danger" });

        const hint = page.getHint();
        await expect.element(hint).toHaveAttribute("variant", "danger");
    });
});

describe("akHint helper function", () => {
    it("should create a basic hint", async () => {
        render(akHint({ body: "This is a basic hint from the builder." }));

        const hint = page.getHint();
        const body = page.getBody();

        await expect.element(hint).toBeInTheDocument();
        await expect.element(body).toBeInTheDocument();
    });

    it("should create hint with title using hint prop", async () => {
        render(akHint({ body: "Body content", hint: "Builder Title" }));

        const title = page.getTitle();
        const body = page.getBody();

        await expect.element(title).toBeInTheDocument();
        await expect.element(body).toBeInTheDocument();
    });

    it("should create hint with footer", async () => {
        render(akHint({ body: "Body content", footer: "Builder footer" }));

        const footer = page.getFooter();

        await expect.element(footer).toBeInTheDocument();
    });

    it("should create hint with all options", async () => {
        render(
            akHint({
                body: "Complete body content",
                hint: "Complete Title",
                footer: "Complete footer with details",
            }),
        );

        const title = page.getTitle();
        const body = page.getBody();
        const footer = page.getFooter();

        await expect.element(title).toBeInTheDocument();
        await expect.element(body).toBeInTheDocument();
        await expect.element(footer).toBeInTheDocument();
    });

    it("should handle template content", async () => {
        render(
            akHint({
                body: html`<p>HTML <strong>content</strong> in body</p>`,
                hint: "HTML Title",
                footer: html`<div>Footer with <a href="#">link</a></div>`,
            }),
        );

        const title = page.getTitle();
        const body = page.getBody();
        const footer = page.getFooter();

        const hint = await page.getHint().element();
        expect(hint.querySelector("strong")).not.toBeNull();
        expect(hint.querySelector("a")).not.toBeNull();
    });

    it("should handle empty options", async () => {
        render(akHint());

        const hint = page.getHint();
        await expect.element(hint).toBeInTheDocument();
    });

    it("should maintain component functionality with grid layout", async () => {
        render(akHint({ body: "Test content", hint: "Test" }));

        const container = page.getHintContainer();
        await expect.element(container).toBeInTheDocument();

        const element = await container.element();
        const style = window.getComputedStyle(element);
        expect(style.display).toBe("grid");
    });

    it("should apply variant through builder", async () => {
        render(akHint({ body: "Success message", variant: "success" }));

        const hint = page.getHint();
        await expect.element(hint).toHaveAttribute("variant", "success");
    });

    it("should spread additional attributes", async () => {
        render(akHint({ "body": "Test", "id": "custom-hint", "data-testid": "hint-test" }));

        const hint = page.getHint();
        await expect.element(hint).toHaveAttribute("id", "custom-hint");
        await expect.element(hint).toHaveAttribute("data-testid", "hint-test");
    });
});
