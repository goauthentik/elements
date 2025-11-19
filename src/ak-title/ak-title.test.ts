import "./ak-title.js";

import { akTitle } from "./ak-title.builder.js";

import { spread } from "@open-wc/lit-helpers";
import { $, browser, expect } from "@wdio/globals";

import { html, render, TemplateResult } from "lit";

describe("ak-title component", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-title")?.remove();
            // Clean up test styles
            document.querySelectorAll(".test-style").forEach((el) => el.remove());
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    const renderComponent = async (
        content: string | TemplateResult = "Test Title",
        properties = {},
    ) => {
        const root = render(
            html`<ak-title ${spread(properties)}>${content}</ak-title>`,
            document.body,
        );
        await browser.pause(100);
        return root;
    };

    it("renders basic title with default properties", async () => {
        await renderComponent("Basic Test Title");

        const title = await $("ak-title");
        const body = await title.$('>>>[part="body"]');
        const icon = await title.$('>>>[part="icon"]');
        const end = await title.$('>>>[part="end"]');

        await expect(title).toExist();
        await expect(body).toExist();
        await expect(body).toHaveText("Basic Test Title");
        await expect(icon).not.toExist();
        await expect(end).not.toExist();
    });

    it("renders with explicit icon slot", async () => {
        await renderComponent(html`
            <i class="fas fa-cog" slot="icon"></i>
            Settings Title
        `);

        const title = await $("ak-title");
        const icon = await title.$('>>>[part="icon"]');
        const body = await title.$('>>>[part="body"]');

        await expect(icon).toExist();
        await expect(body).toHaveText("Settings Title");

        const iconSlot = await icon.$("slot[name='icon']");
        await expect(iconSlot).toExist();
    });

    it("auto-slots single FontAwesome icon", async () => {
        await renderComponent(html`
            <i class="fas fa-home" id="auto-icon"></i>
            Home Title
        `);

        // Wait for mutation observer to process
        await browser.pause(150);

        const title = await $("ak-title");
        const autoIcon = await title.$(">>>#auto-icon");
        const iconContainer = await title.$('>>>[part="icon"]');

        await expect(iconContainer).toExist();

        const slotValue = await autoIcon.getAttribute("slot");
        expect(slotValue).toBe("icon");
    });

    it("auto-slots single 'fas' class icon", async () => {
        await renderComponent(html`
            <i class="fas fa-star" id="fas-icon"></i>
            Featured Content
        `);

        await browser.pause(150);

        const fasIcon = await $("ak-title").$(">>>#fas-icon");
        const slotValue = await fasIcon.getAttribute("slot");
        expect(slotValue).toBe("icon");
    });

    it("auto-slots ak-icon elements", async () => {
        await renderComponent(html`
            <ak-icon icon="bell" id="ak-icon"></ak-icon>
            Notifications
        `);

        await browser.pause(150);

        const akIcon = await $("ak-title").$(">>>ak-icon");
        const slotValue = await akIcon.getAttribute("slot");
        expect(slotValue).toBe("icon");
    });

    it("does not auto-slot when no-auto-slot is true", async () => {
        await renderComponent(
            html`
                <i class="fas fa-gear" id="no-auto"></i>
                No Auto Slot Title
            `,
            { "no-auto-slot": true },
        );

        await browser.pause(150);

        const noAutoIcon = await $("ak-title").$(">>>#no-auto");
        const slotValue = await noAutoIcon.getAttribute("slot");
        const iconContainer = await $("ak-title").$('>>>[part="icon"]');

        expect(slotValue).toBeNull();
        await expect(iconContainer).not.toExist();
    });

    it("does not auto-slot multiple icons", async () => {
        await renderComponent(html`
            <i class="fas fa-star" id="icon1"></i>
            <i class="fas fa-heart" id="icon2"></i>
            Multiple Icons
        `);

        await browser.pause(150);

        const icon1 = await $("ak-title").$(">>>#icon1");
        const icon2 = await $("ak-title").$(">>>#icon2");
        const iconContainer = await $("ak-title").$('>>>[part="icon"]');

        const slot1 = await icon1.getAttribute("slot");
        const slot2 = await icon2.getAttribute("slot");

        expect(slot1).toBeNull();
        expect(slot2).toBeNull();
        await expect(iconContainer).not.toExist();
    });

    it("does not auto-slot when icon slot already exists", async () => {
        await renderComponent(html`
            <i class="fas fa-cog" slot="icon"></i>
            <i class="fas fa-star" id="should-not-slot"></i>
            Title with Existing Icon
        `);

        await browser.pause(150);

        const shouldNotSlot = await $("ak-title").$(">>>#should-not-slot");
        const slotValue = await shouldNotSlot.getAttribute("slot");

        expect(slotValue).toBeNull();
    });

    it("renders external link when href is provided", async () => {
        await renderComponent("Link Title", { href: "/external-page" });

        const title = await $("ak-title");
        const end = await title.$('>>>[part="end"]');
        const link = await end.$("a");

        await expect(end).toExist();
        await expect(link).toExist();
        await expect(link).toHaveAttribute("href", "/external-page");

        const linkIcon = await link.$("ak-icon");
        await expect(linkIcon).toExist();
        await expect(linkIcon).toHaveAttribute("icon", "fas fa-external-link-alt");
    });

    it("does not render link for empty href", async () => {
        await renderComponent("No Link", { href: "" });

        const end = await $("ak-title").$('>>>[part="end"]');
        await expect(end).not.toExist();
    });

    it("does not render link for whitespace-only href", async () => {
        await renderComponent("No Link", { href: "   " });

        const end = await $("ak-title").$('>>>[part="end"]');
        await expect(end).not.toExist();
    });

    it("renders complete title with icon and link", async () => {
        await renderComponent(
            html`
                <i class="fas fa-user" slot="icon"></i>
                User Profile
            `,
            { href: "/user/details", size: "lg" },
        );

        const title = await $("ak-title");
        const icon = await title.$('>>>[part="icon"]');
        const body = await title.$('>>>[part="body"]');
        const end = await title.$('>>>[part="end"]');

        await expect(title).toHaveAttribute("size", "lg");
        await expect(icon).toExist();
        await expect(body).toHaveText("User Profile");
        await expect(end).toExist();

        const link = await end.$("a");
        await expect(link).toHaveAttribute("href", "/user/details");
    });

    it("exposes correct CSS parts", async () => {
        await renderComponent(
            html`
                <i class="fas fa-test" slot="icon"></i>
                Parts Test
            `,
            { href: "/test" },
        );

        const title = await $("ak-title");
        const titlePart = await title.$(">>>[part='title']");
        const startPart = await title.$(">>>[part='start']");
        const iconPart = await title.$(">>>[part='icon']");
        const bodyPart = await title.$(">>>[part='body']");
        const linkPart = await title.$(">>>[part='end']");

        await expect(titlePart).toExist();
        await expect(startPart).toExist();
        await expect(iconPart).toExist();
        await expect(bodyPart).toExist();
        await expect(linkPart).toExist();
    });

    it("handles text truncation properly", async () => {
        await browser.execute(() => {
            const style = document.createElement("style");
            style.className = "test-style";
            style.textContent = `
                .narrow-container ak-title {
                    width: 200px;
                }
            `;
            document.head.appendChild(style);
        });

        await renderComponent(
            "This is a very long title that should demonstrate text overflow behavior",
            { class: "narrow-container" },
        );

        const body = await $("ak-title").$('>>>[part="body"]');
        const overflow = await body.getCSSProperty("text-overflow");
        const whiteSpace = await body.getCSSProperty("white-space");

        expect(overflow.value).toBe("ellipsis");
        expect(whiteSpace.value).toBe("nowrap");
    });

    it("maintains proper layout structure", async () => {
        await renderComponent(
            html`
                <i class="fas fa-layout" slot="icon"></i>
                Layout Test
            `,
            { href: "/layout" },
        );

        const main = await $("ak-title").$('>>>[part="title"]');
        const start = await main.$('>>>[part="start"]');
        const end = await main.$('>>>[part="end"]');

        const mainDisplay = await main.getCSSProperty("display");
        const mainFlex = await main.getCSSProperty("flex-direction");

        expect(mainDisplay.value).toBe("flex");
        expect(mainFlex.value).toBe("row");

        await expect(start).toExist();
        await expect(end).toExist();
    });
});

describe("akTitle helper function", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-title")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    it("should create a basic title", async () => {
        render(akTitle({ content: "Basic Builder Title" }), document.body);

        const title = await $("ak-title");
        const body = await title.$('>>>[part="body"]');

        await expect(title).toExist();
        await expect(body).toHaveText("Basic Builder Title");
    });

    it("should create title with size option", async () => {
        render(akTitle({ content: "Large Title", size: "xl" }), document.body);

        const title = await $("ak-title");
        await expect(title).toHaveAttribute("size", "xl");
    });

    it("should create title with href option", async () => {
        render(akTitle({ content: "Link Title", href: "/builder-link" }), document.body);

        const title = await $("ak-title");
        const end = await title.$('>>>[part="end"]');
        const link = await end.$("a");

        await expect(end).toExist();
        await expect(title).toHaveAttribute("href", "/builder-link");
        await expect(await link.getProperty("href")).toContain("/builder-link");
    });

    it("should create title with icon option", async () => {
        render(
            akTitle({ content: "Icon Title", icon: html`<i class="fas fa-builder"></i>` }),
            document.body,
        );

        const title = await $("ak-title");
        const icon = await title.$('>>>[part="icon"]');
        const iconElement = await icon.$("i");

        await expect(icon).toExist();
        await expect(iconElement).toHaveElementClass("fas");
        await expect(iconElement).toHaveElementClass("fa-builder");
    });

    it("should create title with all options", async () => {
        render(
            akTitle({
                content: "Complete Title",
                size: "lg",
                href: "/complete",
                noAutoSlot: true,
                icon: html`<i class="fas fa-complete"></i>`,
            }),
            document.body,
        );

        const title = await $("ak-title");

        await expect(title).toHaveAttribute("size", "lg");
        await expect(title).toHaveElementProperty("href", "/complete");
        await expect(title).toHaveAttribute("no-auto-slot");

        const icon = await title.$('>>>[part="icon"]');
        const end = await title.$('>>>[part="end"]');

        await expect(icon).toExist();
        await expect(end).toExist();
    });

    it("should handle template content", async () => {
        render(
            akTitle({ content: html`<strong>Bold</strong> Builder Title`, size: "md" }),
            document.body,
        );

        const title = await $("ak-title");
        const body = await title.$('>>>[part="body"]');
        const strong = await body.$("strong");

        await expect(strong).toExist();
        await expect(strong).toHaveText("Bold");
    });

    it("should handle string icon content", async () => {
        render(akTitle({ content: "String Icon", icon: "📍" }), document.body);

        const title = await $("ak-title");
        const icon = await title.$('>>>[part="icon"]');

        await expect(icon).toExist();
        await expect(icon).toHaveText("📍");
    });

    it("should handle boolean properties correctly", async () => {
        render(akTitle({ content: "Boolean Test", noAutoSlot: false }), document.body);

        const title = await $("ak-title");
        await expect(title).not.toHaveElementProperty("no-auto-slot");
    });

    it("should handle empty content", async () => {
        render(akTitle(), document.body);

        const title = await $("ak-title");
        await expect(title).toExist();
    });

    it("should maintain component functionality", async () => {
        render(
            akTitle({
                content: "Functionality Test",
                icon: html`<i class="fas fa-test"></i>`,
                href: "/test",
            }),
            document.body,
        );

        const title = await $("ak-title");
        const main = await title.$('>>>[part="title"]');
        const icon = await title.$('>>>[part="icon"]');
        const end = await title.$('>>>[part="end"]');

        // Verify core functionality is preserved
        const display = await main.getCSSProperty("display");
        expect(display.value).toBe("flex");

        await expect(icon).toExist();
        await expect(end).toExist();
    });
});
