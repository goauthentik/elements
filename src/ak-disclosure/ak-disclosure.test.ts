import "./ak-disclosure.js";

import { akDisclosure } from "./ak-disclosure.js";

import { $, $$, browser, expect } from "@wdio/globals";

import { html, render, TemplateResult } from "lit";

describe("ak-disclosure component", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-disclosure")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    const present = async (element: TemplateResult) => {
        await render(element, document.body);
        const disclosure = await $("ak-disclosure");
        const label = await $("label");
        const toggle = await disclosure.$(">>>[part='toggle']");
        const content = await disclosure.$(">>>[part='content']");
        const iconContainer = await disclosure.$(">>>[part='icon']");
        const labelSlot = await disclosure.$(">>>slot[name='label']");
        const openLabelSlot = await disclosure.$(">>>slot[name='label-open']");
        return { disclosure, label, toggle, content, iconContainer, labelSlot, openLabelSlot };
    };

    it("should render closed by default", async () => {
        const { disclosure, toggle, content } = await present(
            html`<ak-disclosure>
                <label>Test Label</label>
                <p>Test content</p>
            </ak-disclosure>`,
        );

        await expect(disclosure).toExist();
        await expect(disclosure).not.toHaveAttribute("open");
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(content).toHaveAttribute("hidden");
    });

    it("should render open when open attribute is set", async () => {
        const { disclosure, toggle, content } = await present(
            html`<ak-disclosure open>
                <label>Test Label</label>
                <p>Test content</p>
            </ak-disclosure>`,
        );

        await expect(disclosure).toHaveAttribute("open");
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await expect(content).not.toHaveAttribute("hidden");
    });

    it("should toggle when clicked", async () => {
        const { disclosure, label, toggle, content } = await present(
            html`<ak-disclosure>
                <label>Click me</label>
                <p>Toggle content</p>
            </ak-disclosure>`,
        );

        // Initially closed
        await expect(disclosure).not.toHaveAttribute("open");
        await expect(toggle).toHaveAttribute("aria-expanded", "false");

        // Click the disclosure itself (which will bubble to the button)
        await label.click();
        await expect(disclosure).toHaveAttribute("open");
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await expect(content).not.toHaveAttribute("hidden");

        // Click to close
        await label.click();
        await expect(disclosure).not.toHaveAttribute("open");
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(content).toHaveAttribute("hidden");
    });

    it("should dispatch toggle event when clicked", async () => {
        await present(
            html`<ak-disclosure>
                <label>Event test</label>
                <p>Content</p>
            </ak-disclosure>`,
        );

        // Listen for toggle event
        const eventFired = await browser.executeAsync((done) => {
            const disclosure = document.querySelector("ak-disclosure");
            let eventCount = 0;

            disclosure?.addEventListener("toggle", () => {
                eventCount++;
                if (eventCount === 2) done(true); // Wait for both open and close events
            });

            // Trigger two clicks on the label
            const label = document.querySelector("label");
            label?.click();
            setTimeout(() => label?.click(), 50);
        });

        await expect(eventFired).toBe(true);
    });

    it("should auto-slot single label element", async () => {
        const { labelSlot, label } = await present(
            html`<ak-disclosure>
                <label>Auto-slotted label</label>
                <p>Content here</p>
            </ak-disclosure>`,
        );

        await expect(labelSlot).toExist();
        await expect(label).toHaveAttribute("slot", "label");
    });

    it("should not auto-slot when multiple labels exist", async () => {
        present(
            html`<ak-disclosure>
                <label>First label</label>
                <label>Second label</label>
                <p>Content here</p>
            </ak-disclosure>`,
        );

        // Labels should not have slot attributes
        const labels = await $$("ak-disclosure label");
        for (const label of labels) {
            await expect(label).not.toHaveAttribute("slot");
        }
    });

    it("should not auto-slot when explicit slot is provided", async () => {
        present(
            html`<ak-disclosure>
                <label>This should not be auto-slotted</label>
                <span slot="label">Explicit slot content</span>
                <p>Content here</p>
            </ak-disclosure>`,
        );

        const label = await $("ak-disclosure label");
        await expect(label).not.toHaveAttribute("slot");

        const explicitSlot = await $("ak-disclosure [slot='label']");
        await expect(explicitSlot).toExist();
    });

    it("should render different labels for open and closed states", async () => {
        const { labelSlot, openLabelSlot } = await present(
            html`<ak-disclosure>
                <span slot="label">Show details</span>
                <span slot="label-open">Hide details</span>
                <p>Toggleable content</p>
            </ak-disclosure>`,
        );

        const labelElement = await $("[slot='label']");

        await expect(labelSlot).toExist();
        await labelElement.click();
        await expect(openLabelSlot).toExist();
    });

    it("should render default icon when no custom icon provided", async () => {
        const { iconContainer } = await present(
            html`<ak-disclosure>
                <label>Default icon test</label>
                <p>Content</p>
            </ak-disclosure>`,
        );

        await expect(iconContainer).toExist();

        const defaultIcon = await iconContainer.$(">>>i.fa-angle-right");
        await expect(defaultIcon).toExist();
        await expect(defaultIcon).toHaveAttribute("aria-hidden", "true");
    });

    it("should have proper ARIA attributes", async () => {
        const { label, toggle, content } = await present(
            html`<ak-disclosure>
                <label>ARIA test</label>
                <p>Accessible content</p>
            </ak-disclosure>`,
        );

        await expect(content).not.toBeDisplayed();
        await expect(toggle).toHaveAttribute("aria-controls", "content");
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(toggle).toHaveAttribute("id", "toggle");

        await label.click();
        await expect(content).toBeDisplayed();
        await expect(content).toHaveAttribute("aria-labelledby", "toggle");
        await expect(content).toHaveAttribute("id", "content");
    });

    it("should handle dynamic content updates", async () => {
        const { label, content } = await present(
            html`<ak-disclosure>
                <label>Dynamic content test</label>
                <p>Initial content</p>
            </ak-disclosure>`,
        );

        // Add new content dynamically
        await browser.execute(() => {
            const disclosure = document.querySelector("ak-disclosure");
            const newP = document.createElement("p");
            newP.textContent = "Dynamically added content";
            disclosure?.appendChild(newP);
        });

        // Content should still be accessible
        await label.click();
        await expect(content).not.toHaveAttribute("hidden");
    });
});

describe("akDisclosure builder function", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-disclosure")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    it("should render using akDisclosure helper function", async () => {
        render(
            akDisclosure({
                content: html`<p>This content was created using the helper function.</p>`,
                label: html`<span>Helper Function Label</span>`,
                open: true,
            }),
            document.body,
        );

        const disclosure = await $("ak-disclosure");
        await expect(disclosure).toExist();
        await expect(disclosure).toHaveAttribute("open");

        const labelSlot = await disclosure.$(">>>[slot='label']");
        await expect(labelSlot).toExist();

        const content = await disclosure.$(">>>[part='content']");
        await expect(content).not.toHaveAttribute("hidden");
    });

    it("should render with both label and label-open using helper function", async () => {
        render(
            akDisclosure({
                content: html`<p>Helper function with dual labels</p>`,
                label: html`<span>Show content</span>`,
                labelOpen: html`<span>Hide content</span>`,
                open: false,
            }),
            document.body,
        );

        const disclosure = await $("ak-disclosure");
        const labelSlot = await disclosure.$(">>>[slot='label']");
        const openLabelSlot = await disclosure.$(">>>[slot='label-open']");
        const labelElement = await $("[slot='label']");

        await expect(labelSlot).toExist();
        await expect(openLabelSlot).toExist();

        // Should show closed label initially, click it to open
        await labelElement.click();

        // After clicking, should be open and show open label
        await expect(disclosure).toHaveAttribute("open");
    });

    it("should render with minimal options using helper function", async () => {
        render(
            akDisclosure({ content: html`<p>Minimal helper function usage</p>` }),
            document.body,
        );

        const disclosure = await $("ak-disclosure");
        await expect(disclosure).toExist();
        await expect(disclosure).not.toHaveAttribute("open");

        const content = await disclosure.$(">>>[part='content']");
        await expect(content).toHaveAttribute("hidden");
    });

    it("should handle complex content with helper function", async () => {
        render(
            akDisclosure({
                content: html`
                    <div>
                        <h3>Complex Content</h3>
                        <ul>
                            <li>Item 1</li>
                            <li>Item 2</li>
                            <li>Item 3</li>
                        </ul>
                        <button>Action Button</button>
                    </div>
                `,
                label: html`<strong>Show complex content</strong>`,
                open: true,
            }),
            document.body,
        );

        const disclosure = await $("ak-disclosure");
        await expect(disclosure).toExist();
        await expect(disclosure).toHaveAttribute("open");

        const heading = await $("ak-disclosure h3");
        await expect(heading).toExist();

        const button = await $("ak-disclosure button");
        await expect(button).toExist();
        await expect(button).toHaveText("Action Button");
    });
});
