import "./ak-screensaver.js";

import { akScreensaver, Screensaver } from "./ak-screensaver.js";

import { $, browser, expect } from "@wdio/globals";

import { html, render, TemplateResult } from "lit";

describe("ak-screensaver component", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-screensaver")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    const present = async (element: TemplateResult) => {
        await render(element, document.body);
        const screensaver = await $("ak-screensaver");
        const content = await screensaver.$(">>>[part='screensaver']");
        const slot = await screensaver.$(">>>slot");
        return { screensaver, content, slot };
    };

    it("should render with default properties", async () => {
        const { screensaver, content, slot } = await present(
            html`<ak-screensaver>
                <div>Test content</div>
            </ak-screensaver>`,
        );

        await expect(screensaver).toExist();
        await expect(screensaver).toHaveAttribute("speed", "1");
        await expect(screensaver).not.toHaveAttribute("paused");
        await expect(screensaver).not.toHaveAttribute("force-reduced-motion");
        await expect(screensaver).toHaveElementProperty("reducedMotionInterval", 60);
        await expect(content).toExist();
        await expect(slot).toExist();
    });

    it("should render in paused state when paused attribute is set", async () => {
        const { screensaver, content } = await present(
            html`<ak-screensaver paused>
                <div>Paused content</div>
            </ak-screensaver>`,
        );

        await expect(screensaver).toHaveAttribute("paused");
        await expect(content).toExist();
    });

    it("should apply custom speed attribute", async () => {
        const { screensaver } = await present(
            html`<ak-screensaver speed="2.5">
                <div>Fast content</div>
            </ak-screensaver>`,
        );

        await expect(screensaver).toHaveAttribute("speed", "2.5");
    });

    it("should apply force-reduced-motion attribute", async () => {
        const { screensaver } = await present(
            html`<ak-screensaver force-reduced-motion>
                <div>Reduced motion content</div>
            </ak-screensaver>`,
        );

        await expect(screensaver).toHaveAttribute("force-reduced-motion");
    });

    it("should apply custom reduced-motion-interval", async () => {
        const { screensaver } = await present(
            html`<ak-screensaver reduced-motion-interval="30">
                <div>Custom interval content</div>
            </ak-screensaver>`,
        );

        await expect(screensaver).toHaveAttribute("reduced-motion-interval", "30");
    });

    it("should render slotted content correctly", async () => {
        const { screensaver } = await present(
            html`<ak-screensaver>
                <div>
                    <h1>Heading Content</h1>
                    <p>Paragraph content</p>
                </div>
            </ak-screensaver>`,
        );

        const heading = await screensaver.$(">>>h1");
        const paragraph = await screensaver.$(">>>p");

        await expect(heading).toExist();
        await expect(heading).toHaveText("Heading Content");
        await expect(paragraph).toExist();
        await expect(paragraph).toHaveText("Paragraph content");
    });

    it("should have proper CSS parts", async () => {
        const { screensaver } = await present(
            html`<ak-screensaver>
                <div>Parts test</div>
            </ak-screensaver>`,
        );

        const screensaverPart = await screensaver.$(">>>[part='screensaver']");

        await expect(screensaverPart).toExist();
        await expect(screensaverPart).toHaveAttribute("id", "screensaver");
    });

    it("should handle dynamic property changes", async () => {
        const { screensaver } = await present(
            html`<ak-screensaver speed="1.0">
                <div>Dynamic test</div>
            </ak-screensaver>`,
        );

        await expect(screensaver).toHaveAttribute("speed", "1");

        // Change speed property
        await browser.execute(() => {
            const screensaverElement = document.querySelector("ak-screensaver") as Screensaver;
            screensaverElement.speed = 3.0;
        });

        await expect(screensaver).toHaveAttribute("speed", "3");
    });

    it("should handle pause/unpause correctly", async () => {
        const { screensaver } = await present(
            html`<ak-screensaver>
                <div>Pause test</div>
            </ak-screensaver>`,
        );

        await expect(screensaver).not.toHaveAttribute("paused");

        // Pause the screensaver
        await browser.execute(() => {
            const screensaverElement = document.querySelector("ak-screensaver") as Screensaver;
            screensaverElement.paused = true;
        });

        await expect(screensaver).toHaveAttribute("paused");

        // Unpause the screensaver
        await browser.execute(() => {
            const screensaverElement = document.querySelector("ak-screensaver") as Screensaver;
            screensaverElement.paused = false;
        });

        await expect(screensaver).not.toHaveAttribute("paused");
    });

    it("should position screensaver content absolutely", async () => {
        const { content } = await present(
            html`<ak-screensaver>
                <div>Position test</div>
            </ak-screensaver>`,
        );

        // Check that the screensaver content has absolute positioning
        const position = await content.getCSSProperty("position");
        await expect(position.value).toBe("absolute");
    });

    it("should handle complex HTML content", async () => {
        const { screensaver } = await present(
            html`<ak-screensaver>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="8" fill="currentColor" />
                    </svg>
                    <span>Complex content with SVG</span>
                </div>
            </ak-screensaver>`,
        );

        const complexContent = await screensaver.$("div");
        const svg = await screensaver.$("svg");
        const span = await screensaver.$("span");

        await expect(complexContent).toExist();
        await expect(svg).toExist();
        await expect(span).toExist();
        await expect(span).toHaveText("Complex content with SVG");
    });

    it("should support all boolean property combinations", async () => {
        const { screensaver } = await present(
            html`<ak-screensaver paused force-reduced-motion>
                <div>Boolean combo test</div>
            </ak-screensaver>`,
        );

        await expect(screensaver).toHaveAttribute("paused");
        await expect(screensaver).toHaveAttribute("force-reduced-motion");
    });
});

describe("akScreensaver builder function", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-screensaver")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    // eslint-disable-next-line sonarjs/no-identical-functions
    const present = async (element: TemplateResult) => {
        await render(element, document.body);
        const screensaver = await $("ak-screensaver");
        const content = await screensaver.$(">>>[part='screensaver']");
        const slot = await screensaver.$(">>>slot");
        return { screensaver, content, slot };
    };

    it("should render using akScreensaver helper function", async () => {
        const { screensaver } = await present(
            akScreensaver(html`<div>Helper function content</div>`, {
                speed: 2.0,
                paused: true,
            }),
        );

        await expect(screensaver).toExist();
        await expect(screensaver).toHaveAttribute("speed", "2");
        await expect(screensaver).toHaveAttribute("paused");

        const content = await screensaver.$("div");
        await expect(content).toExist();
        await expect(content).toHaveText("Helper function content");
    });

    it("should render with all options using helper function", async () => {
        const { screensaver } = await present(
            akScreensaver(html`<span>Full options test</span>`, {
                speed: 0.5,
                paused: false,
                forceReducedMotion: true,
                reducedMotionInterval: 15,
            }),
        );

        await expect(screensaver).toHaveAttribute("speed", "0.5");
        await expect(screensaver).not.toHaveAttribute("paused");
        await expect(screensaver).toHaveAttribute("force-reduced-motion");
        await expect(screensaver).toHaveAttribute("reduced-motion-interval", "15");
    });

    it("should render with minimal options using helper function", async () => {
        const { screensaver } = await present(akScreensaver(html`<p>Minimal helper usage</p>`));

        await expect(screensaver).toExist();

        const paragraph = await screensaver.$("p");
        await expect(paragraph).toExist();
        await expect(paragraph).toHaveText("Minimal helper usage");
    });

    it("should handle string content with helper function", async () => {
        const { screensaver } = await present(
            akScreensaver("Simple string content", { speed: 1.5 }),
        );
        await expect(screensaver).toExist();
        await expect(screensaver).toHaveAttribute("speed", "1.5");
    });

    it("should handle complex template with helper function", async () => {
        const { screensaver } = await present(
            akScreensaver(
                html`
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <h2>Complex Template</h2>
                        <button>Action Button</button>
                        <ul>
                            <li>Item 1</li>
                            <li>Item 2</li>
                        </ul>
                    </div>
                `,
                {
                    speed: 1.2,
                    forceReducedMotion: true,
                },
            ),
        );

        await expect(screensaver).toHaveElementProperty("speed", 1.2);
        await expect(screensaver).toHaveAttribute("force-reduced-motion");

        const heading = await screensaver.$("h2");
        const button = await screensaver.$("button");
        const list = await screensaver.$("ul");
        const listItems = await screensaver.$$(">>>li");

        await expect(heading).toExist();
        await expect(heading).toHaveText("Complex Template");
        await expect(button).toExist();
        await expect(button).toHaveText("Action Button");
        await expect(list).toExist();
        await expect(listItems).toHaveLength(2);
    });

    it("should handle boolean edge cases with helper function", async () => {
        const { screensaver } = await present(
            akScreensaver(html`<div>Boolean test</div>`, {
                paused: false, // Explicitly false
                forceReducedMotion: true, // Explicitly true
            }),
        );
        await expect(screensaver).not.toHaveAttribute("paused");
        await expect(screensaver).toHaveAttribute("force-reduced-motion");
    });
});
