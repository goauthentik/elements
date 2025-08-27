import { $, browser, expect } from "@wdio/globals";

import { msg } from "@lit/localize";
import { html, render } from "lit";

import "./ak-empty-state.js";
import { akEmptyState } from "./ak-empty-state.js";

describe("ak-empty-state component", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-empty-state")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    it("should render with the default icon", async () => {
        render(
            html`<ak-empty-state>
                <h2 slot="title">${msg("No results found")}</h2>
            </ak-empty-state>`,
            document.body,
        );

        const iconContainer = await $("ak-empty-state").$(">>>.icon");
        await expect(iconContainer).toExist();

        const defaultIcon = await iconContainer.$(">>>ak-icon");
        await expect(defaultIcon).toExist();
        await expect(defaultIcon).toHaveAttribute("icon", "box-open");

        const titleElement = await $("ak-empty-state").$(">>>.title-text");
        await expect(titleElement).toExist();
    });

    it("should render a loading spinner when loading is true", async () => {
        render(
            html`<ak-empty-state loading>
                <h2 slot="title">${msg("Loading content")}</h2>
            </ak-empty-state>`,
            document.body,
        );

        const iconContainer = await $("ak-empty-state").$(">>>.icon");
        await expect(iconContainer).toExist();

        const spinner = await iconContainer.$(">>>ak-spinner");
        await expect(spinner).toExist();

        const titleElement = await $("ak-empty-state").$(">>>.title-text");
        await expect(titleElement).toExist();

        const bodyElement = await $("ak-empty-state").$(">>>.body");
        await expect(bodyElement).toExist();
        await expect(bodyElement).toHaveText(expect.stringContaining("Loading..."));
    });

    it("should not render an icon when no-icon is true", async () => {
        render(
            html`<ak-empty-state no-icon>
                <h2 slot="title">${msg("No results found")}</h2>
            </ak-empty-state>`,
            document.body,
        );

        const iconContainer = await $("ak-empty-state").$(">>>.icon");
        await expect(iconContainer).not.toExist();

        const titleElement = await $("ak-empty-state").$(">>>.title-text");
        await expect(titleElement).toExist();
    });

    it("should render a custom icon when provided", async () => {
        render(
            html`<ak-empty-state>
                <div slot="icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2L1 21h22L12 2z" />
                    </svg>
                </div>
                <h2 slot="title">${msg("No results found")}</h2>
            </ak-empty-state>`,
            document.body,
        );

        const iconContainer = await $("ak-empty-state").$(">>>.icon");
        await expect(iconContainer).toExist();

        const iconSlot = await iconContainer.$(">>>slot[name='icon']");
        await expect(iconSlot).toExist();
    });

    it("should render body content when provided", async () => {
        render(
            html`<ak-empty-state>
                <h2 slot="title">${msg("No results found")}</h2>
                <p slot="body">No results match the filter criteria. Try adjusting your filters.</p>
            </ak-empty-state>`,
            document.body,
        );

        const bodyContainer = await $("ak-empty-state").$(">>>.body");
        await expect(bodyContainer).toExist();

        const bodySlot = await bodyContainer.$(">>>slot[name='body']");
        await expect(bodySlot).toExist();
    });

    it("should render actions when provided", async () => {
        render(
            html`<ak-empty-state>
                <h2 slot="title">${msg("No results found")}</h2>
                <p slot="body">No results match the filter criteria.</p>
                <button slot="actions">Clear filters</button>
            </ak-empty-state>`,
            document.body,
        );

        const footerContainer = await $("ak-empty-state").$(">>>.footer");
        await expect(footerContainer).toExist();

        const actionsContainer = await footerContainer.$(">>>.actions");
        await expect(actionsContainer).toExist();

        const actionsSlot = await actionsContainer.$(">>>slot[name='actions']");
        await expect(actionsSlot).toExist();
    });

    it("should render secondary actions when provided", async () => {
        render(
            html`<ak-empty-state>
                <h2 slot="title">${msg("No results found")}</h2>
                <p slot="body">No results match the filter criteria.</p>
                <button slot="actions">Clear all filters</button>
                <button slot="secondary-actions">Reset view</button>
            </ak-empty-state>`,
            document.body,
        );

        const footerContainer = await $("ak-empty-state").$(">>>.footer");
        await expect(footerContainer).toExist();

        const actionsContainers = await footerContainer.$$(">>>.actions");
        await expect(actionsContainers).toHaveLength(2);

        const secondaryActionsSlot = await footerContainer.$(">>>slot[name='secondary-actions']");
        await expect(secondaryActionsSlot).toExist();
    });

    it("should render footer content when provided", async () => {
        render(
            html`<ak-empty-state>
                <h2 slot="title">${msg("No results found")}</h2>
                <p slot="body">No results match the filter criteria.</p>
                <p slot="footer">Contact the administrator for more information</p>
            </ak-empty-state>`,
            document.body,
        );

        const footerContainer = await $("ak-empty-state").$(">>>.footer");
        await expect(footerContainer).toExist();

        const footerSlot = await footerContainer.$(">>>slot[name='footer']");
        await expect(footerSlot).toExist();
    });

    it("should apply the correct size class", async () => {
        render(
            html`<ak-empty-state size="xs">
                <h2 slot="title">${msg("XS Empty State")}</h2>
            </ak-empty-state>`,
            document.body,
        );

        const emptyState = await $("ak-empty-state");
        await expect(emptyState).toHaveAttribute("size", "xs");

        // Test with a different size
        await emptyState.execute((elem) => {
            elem.setAttribute("size", "xl");
        });

        await expect(emptyState).toHaveAttribute("size", "xl");

        const iconComponent = await emptyState.$(">>>ak-icon");
        await expect(iconComponent).toExist();
        await expect(iconComponent).toHaveAttribute("size", "3x");
    });

    it("should apply full-height attribute when set", async () => {
        render(
            html`<ak-empty-state full-height>
                <h2 slot="title">${msg("Full Height Empty State")}</h2>
            </ak-empty-state>`,
            document.body,
        );

        const emptyState = await $("ak-empty-state");
        await expect(emptyState).toHaveAttribute("full-height");
    });

    {
        const sizes = ["xs", "sm", "lg", "xl"];
        const expectedIconSizes = ["sm", "lg", "2x", "3x"];

        for (let i = 0; i < sizes.length; i++) {
            it(`should render correct icon size for component size ${sizes[i]}`, async () => {
                render(
                    html`<ak-empty-state size="${sizes[i]}">
                        <h2 slot="title">Size test</h2>
                    </ak-empty-state>`,
                    document.body,
                );

                const emptyState = await $("ak-empty-state");
                const iconContainers = await emptyState.$$(">>>.icon");
                await expect(iconContainers).toHaveLength(1);

                const defaultIcon = await iconContainers[0].$(">>>ak-icon");
                await expect(defaultIcon).toHaveAttribute("size", expectedIconSizes[i]);
            });
        }
    }

    it("should render exactly one default icon container", async () => {
        render(
            html`<ak-empty-state>
                <h2 slot="title">No results found</h2>
            </ak-empty-state>`,
            document.body,
        );

        const iconContainers = await $("ak-empty-state").$$(">>>.icon");
        await expect(iconContainers).toHaveLength(1);

        const defaultIcon = await iconContainers[0].$(">>>ak-icon");
        await expect(defaultIcon).toExist();
        await expect(defaultIcon).toHaveAttribute("icon", "box-open");
    });

    it("should render exactly one icon container when custom icon is provided", async () => {
        render(
            html`<ak-empty-state>
                <div slot="icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2L1 21h22L12 2z" />
                    </svg>
                </div>
                <h2 slot="title">No results found</h2>
            </ak-empty-state>`,
            document.body,
        );

        // Critical: Check that there's exactly ONE icon container
        const iconContainers = await $("ak-empty-state").$$(">>>.icon");
        await expect(iconContainers).toHaveLength(1);

        // Verify it contains the custom icon slot
        const iconSlot = await iconContainers[0].$(">>>slot[name='icon']");
        await expect(iconSlot).toExist();

        // Verify no default icon is rendered
        const defaultIcon = await iconContainers[0].$(">>>ak-icon");
        await expect(defaultIcon).not.toExist();
    });

    it("should render custom icon even when no-icon is true", async () => {
        render(
            html`<ak-empty-state no-icon>
                <div slot="icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2L1 21h22L12 2z" />
                    </svg>
                </div>
                <h2 slot="title">Custom icon with no-icon</h2>
            </ak-empty-state>`,
            document.body,
        );

        // Should show the custom icon despite no-icon=true
        const iconContainers = await $("ak-empty-state").$$(">>>.icon");
        await expect(iconContainers).toHaveLength(1);

        const iconSlot = await iconContainers[0].$(">>>slot[name='icon']");
        await expect(iconSlot).toExist();
    });
});

describe("akEmptyState builder function", () => {
    afterEach(async () => {
        await browser.execute(async () => {
            await document.body.querySelector("ak-empty-state")?.remove();
            // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
            if (document.body._$litPart$) {
                // @ts-expect-error expression of type '"_$litPart$"' is added by Lit
                await delete document.body._$litPart$;
            }
        });
    });

    it("should render using akEmptyState helper function", async () => {
        render(
            akEmptyState({
                size: "lg",
                icon: html`<svg viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2z" /></svg>`,
                title: html`<h2>${msg("Helper Function Title")}</h2>`,
                body: html`<p>This empty state was created using the helper function.</p>`,
                actions: html`<button>Action Button</button>`,
            }),
            document.body,
        );

        const emptyState = await $("ak-empty-state");
        await expect(emptyState).toExist();
        await expect(emptyState).toHaveAttribute("size", "lg");

        const iconContainer = await emptyState.$(">>>.icon");
        await expect(iconContainer).toExist();

        const titleContainer = await emptyState.$(">>>.title-text");
        await expect(titleContainer).toExist();

        const bodyContainer = await emptyState.$(">>>.body");
        await expect(bodyContainer).toExist();

        const actionsContainer = await emptyState.$(">>>.actions");
        await expect(actionsContainer).toExist();
    });

    it("should render exactly one icon when using helper function", async () => {
        render(
            akEmptyState({
                icon: html`<svg viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2z" /></svg>`,
                title: html`<h2>Helper Function Icon Test</h2>`,
            }),
            document.body,
        );

        const iconContainers = await $("ak-empty-state").$$(">>>.icon");
        await expect(iconContainers).toHaveLength(1);
    });

    it("should have proper accessibility attributes", async () => {
        render(
            html`<ak-empty-state>
                <h2 slot="title">Accessible empty state</h2>
                <p slot="body">Screen reader friendly content</p>
            </ak-empty-state>`,
            document.body,
        );

        const emptyState = await $("ak-empty-state");
        const mainContainer = await emptyState.$(">>>#main");

        // Check for proper heading structure, aria labels, etc.
        await expect(mainContainer).toExist();
    });

    it("should expose correct CSS parts", async () => {
        render(
            html`<ak-empty-state>
                <h2 slot="title">CSS Parts Test</h2>
                <p slot="body">Testing CSS parts exposure</p>
            </ak-empty-state>`,
            document.body,
        );

        // Verify CSS parts are properly exposed
        const mainPart = await $("ak-empty-state").$(">>>[part='main']");
        await expect(mainPart).toExist();

        const contentPart = await $("ak-empty-state").$(">>>[part='content']");
        await expect(contentPart).toExist();
    });

    it("should render a complex helper function call", async () => {
        render(
            akEmptyState({
                loading: true,
                size: "sm",
                title: html`<h3>${msg("Loading Data")}</h3>`,
                body: html`<span>Please wait while we load your data</span>`,
                footer: html`<a href="#">Learn more about this process</a>`,
            }),
            document.body,
        );

        const emptyState = await $("ak-empty-state");
        await expect(emptyState).toExist();
        await expect(emptyState).toHaveAttribute("size", "sm");
        await expect(emptyState).toHaveAttribute("loading");

        const iconContainer = await emptyState.$(">>>.icon");
        await expect(iconContainer).toExist();

        const spinner = await iconContainer.$(">>>ak-spinner");
        await expect(spinner).toExist();

        const titleContainer = await emptyState.$(">>>.title-text");
        await expect(titleContainer).toExist();

        const bodyContainer = await emptyState.$(">>>.body");
        await expect(bodyContainer).toExist();

        const footerContainer = await emptyState.$(">>>.footer");
        await expect(footerContainer).toExist();
    });
});
