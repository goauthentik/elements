import "./ak-divider.js";

import { akDivider } from "./ak-divider.js";

import { spread } from "@open-wc/lit-helpers";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-lit";
import { Locator, locators, page } from "vitest/browser";

import { html, nothing, type TemplateResult } from "lit";

locators.extend({
    getDivider() {
        return "ak-divider";
    },
    getDividerContainer() {
        return 'ak-divider >> [part="divider"]';
    },
    getDividerLine() {
        return 'ak-divider >> [part="line"]';
    },
    getDividerContent() {
        return 'ak-divider >> [part="content"]';
    },
});

declare module "vitest/browser" {
    interface LocatorSelectors {
        getDivider(): Locator;
        getDividerContainer(): Locator;
        getDividerLine(): Locator;
        getDividerContent(): Locator;
    }
}

type Content = string | TemplateResult | typeof nothing;

describe("ak-divider component", () => {
    const renderComponent = (content: Content = "", properties = {}) => {
        return render(html`<ak-divider ${spread(properties)}>${content}</ak-divider>`);
    };

    it("should render the divider", async () => {
        render(html`<ak-divider></ak-divider>`);
        const divider = await page.getDivider();
        await expect.element(divider).toBeInTheDocument();
    });

    it("should render the divider with a single line when no content", async () => {
        render(html`<ak-divider></ak-divider>`);
        const line = await page.getDividerLine();
        await expect.element(line).toBeInTheDocument();
        await expect.element(line).toHaveAttribute("part", "line");
    });

    it("should render the divider with the specified text", async () => {
        render(html`<ak-divider><span>Your Message Here</span></ak-divider>`);
        const divider = await page.getDivider();
        const content = await page.getDividerContent();

        await expect.element(divider).toBeInTheDocument();
        await expect.element(content).toBeInTheDocument();
        await expect.element(divider).toHaveTextContent("Your Message Here");
    });

    it("should render three parts when content is present", async () => {
        renderComponent(html`<span>Message</span>`);
        const component = await page.getDivider().element();
        const shadowRoot = component.shadowRoot!;

        const lineStart = shadowRoot.querySelector('[part="line start"]');
        const lineEnd = shadowRoot.querySelector('[part="line end"]');
        const content = shadowRoot.querySelector('[part="content"]');

        expect(lineStart).not.toBeNull();
        expect(lineEnd).not.toBeNull();
        expect(content).not.toBeNull();
    });

    it("should render the divider using builder function with text", async () => {
        render(akDivider({ content: "Your Message As A Function" }));
        const divider = await page.getDivider();
        const content = await page.getDividerContent();

        await expect.element(divider).toBeVisible();
        await expect.element(content).toBeVisible();
        await expect.element(divider).toHaveTextContent("Your Message As A Function");
    });

    it("should render the divider using builder function with no content", async () => {
        render(akDivider());
        const divider = await page.getDivider();
        await expect.element(divider).toBeInTheDocument();
    });

    it("should apply variant attribute", async () => {
        renderComponent(undefined, { variant: "strong" });
        const divider = await page.getDivider();
        await expect.element(divider).toHaveAttribute("variant", "strong");
    });

    it("should apply orientation attribute", async () => {
        renderComponent(undefined, { orientation: "vertical" });
        const divider = await page.getDivider();
        await expect.element(divider).toHaveAttribute("orientation", "vertical");
    });

    it("should render using builder with variant and orientation", async () => {
        render(akDivider({ variant: "subtle", orientation: "vertical", content: "Vertical" }));
        const divider = await page.getDivider();

        await expect.element(divider).toBeVisible();
        await expect.element(divider).toHaveAttribute("variant", "subtle");
        await expect.element(divider).toHaveAttribute("orientation", "vertical");
    });
});
