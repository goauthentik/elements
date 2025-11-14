import "./ak-empty-state.js";

import { akEmptyState } from "./ak-empty-state.js";

import { $, browser, expect } from "@wdio/globals";

import { msg } from "@lit/localize";
import { html, render, type TemplateResult } from "lit";

describe("ak-empty-state component", () => {
    let container: WebdriverIO.Element;

    beforeEach(async () => {
        document.body.innerHTML = `<div id="container"></div>`;
        // @ts-expect-error It's mistyping this badly.
        container = await $("#container");
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

    const provide = async (template: TemplateResult) => {
        const innerContainer = document.querySelector("#container");
        if (!(innerContainer && innerContainer instanceof HTMLElement)) {
            throw new Error("Unable to find container. /* CAN'T HAPPEN */");
        }
        await render(template, innerContainer);
        await browser.pause(100);

        const component = await container.$("ak-empty-state");
        return {
            component,
            content: await component.$('>>>[part="content"]'),
            icon: await component.$('>>>[part="icon"]'),
            titleText: await component.$('>>>[part="title"]'),
            body: await component.$('>>>[part="body"]'),
            footer: await component.$('>>>[part="footer"]'),
            actions: await component.$('>>>[part="actions"]'),
        };
    };

    it("should render with the default icon", async () => {
        const { icon, titleText } = await provide(
            html`<ak-empty-state>
                <h2 slot="title">${msg("No results found")}</h2>
            </ak-empty-state>`,
        );

        await expect(icon).toExist();

        const defaultIcon = await icon.$(">>>ak-icon");

        await expect(defaultIcon).toExist();
        await expect(defaultIcon).toHaveAttribute("icon", "fa fa-cubes");
        await expect(titleText).toExist();
    });

    it("should render a loading spinner when loading is true", async () => {
        const { icon, titleText, body } = await provide(
            html`<ak-empty-state loading>
                <h2 slot="title">${msg("Loading content")}</h2>
            </ak-empty-state>`,
        );

        await expect(icon).toExist();

        const spinner = await icon.$(">>>ak-spinner");
        await expect(spinner).toExist();
        await expect(titleText).toExist();
        await expect(body).toExist();
        await expect(body).toHaveText(expect.stringContaining("Loading..."));
    });

    it("should not render an icon when no-icon is true", async () => {
        const { icon, titleText } = await provide(
            html`<ak-empty-state no-icon>
                <h2 slot="title">${msg("No results found")}</h2>
            </ak-empty-state>`,
        );

        await expect(icon).not.toExist();
        await expect(titleText).toExist();
    });

    it("should render a custom icon when provided", async () => {
        const { icon } = await provide(
            html`<ak-empty-state>
                <div slot="icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2L1 21h22L12 2z" />
                    </svg>
                </div>
                <h2 slot="title">${msg("No results found")}</h2>
            </ak-empty-state>`,
        );

        await expect(icon).toExist();

        const iconSlot = await icon.$(">>>slot[name='icon']");
        await expect(iconSlot).toExist();
    });

    it("should render body content when provided", async () => {
        const { body } = await provide(
            html`<ak-empty-state>
                <h2 slot="title">${msg("No results found")}</h2>
                <p slot="body">No results match the filter criteria. Try adjusting your filters.</p>
            </ak-empty-state>`,
        );

        await expect(body).toExist();

        const bodySlot = await body.$(">>>slot[name='body']");
        await expect(bodySlot).toExist();
    });

    it("should render actions when provided", async () => {
        const { footer, actions } = await provide(
            html`<ak-empty-state>
                <h2 slot="title">${msg("No results found")}</h2>
                <p slot="body">No results match the filter criteria.</p>
                <button slot="actions">Clear filters</button>
            </ak-empty-state>`,
        );

        await expect(footer).toExist();
        await expect(actions).toExist();

        const actionsSlot = await actions.$(">>>slot[name='actions']");
        await expect(actionsSlot).toExist();
    });

    it("should render footer content when provided", async () => {
        const { footer } = await provide(
            html`<ak-empty-state>
                <h2 slot="title">${msg("No results found")}</h2>
                <p slot="body">No results match the filter criteria.</p>
                <p slot="footer">Contact the administrator for more information</p>
            </ak-empty-state>`,
        );

        await expect(footer).toExist();

        const footerSlot = await footer.$(">>>slot[name='footer']");
        await expect(footerSlot).toExist();
    });

    it("should apply the correct size class", async () => {
        const { component } = await provide(
            html`<ak-empty-state size="xs">
                <h2 slot="title">${msg("XS Empty State")}</h2>
            </ak-empty-state>`,
        );

        await expect(component).toHaveAttribute("size", "xs");

        // Test with a different size
        await component.execute((elem) => {
            elem.setAttribute("size", "xl");
        });

        await expect(component).toHaveAttribute("size", "xl");
        const iconComponent = await component.$(">>>ak-icon");
        await expect(iconComponent).toExist();
        await expect(iconComponent).toHaveAttribute("size", "6x");
    });

    it("should apply full-height attribute when set", async () => {
        const { component } = await provide(
            html`<ak-empty-state full-height>
                <h2 slot="title">${msg("Full Height Empty State")}</h2>
            </ak-empty-state>`,
        );

        await expect(component).toHaveAttribute("full-height");
    });

    it("should render custom icon even when no-icon is true", async () => {
        const { component } = await provide(
            html`<ak-empty-state no-icon>
                <div slot="icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2L1 21h22L12 2z" />
                    </svg>
                </div>
                <h2 slot="title">Custom icon with no-icon</h2>
            </ak-empty-state>`,
        );

        // Should show the custom icon despite no-icon=true
        const icons = await component.$$('[part="icon"]');
        await expect(icons).toHaveLength(1);

        const iconSlot = await icons[0].$(">>>slot[name='icon']");
        await expect(iconSlot).toExist();
    });
});

describe("akEmptyState builder function", () => {
    let container: WebdriverIO.Element;

    beforeEach(async () => {
        document.body.innerHTML = `<div id="container"></div>`;
        // @ts-expect-error It's mistyping this badly.
        container = await $("#container");
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

    // eslint-disable-next-line sonarjs/no-identical-functions
    const provide = async (template: TemplateResult) => {
        const innerContainer = document.querySelector("#container");
        if (!(innerContainer && innerContainer instanceof HTMLElement)) {
            throw new Error("Unable to find container. /* CAN'T HAPPEN */");
        }
        await render(template, innerContainer);
        await browser.pause(100);

        const component = await container.$("ak-empty-state");
        return {
            component,
            content: await component.$('>>>[part="content"]'),
            icon: await component.$('>>>[part="icon"]'),
            titleText: await component.$('>>>[part="title"]'),
            body: await component.$('>>>[part="body"]'),
            footer: await component.$('>>>[part="footer"]'),
            actions: await component.$('>>>[part="actions"]'),
        };
    };

    it("should render using akEmptyState helper function", async () => {
        const { component, icon, titleText, body, actions } = await provide(
            akEmptyState({
                size: "lg",
                icon: html`<svg viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2z" /></svg>`,
                title: html`<h2>${msg("Helper Function Title")}</h2>`,
                body: html`<p>This empty state was created using the helper function.</p>`,
                actions: html`<button>Action Button</button>`,
            }),
        );

        await expect(component).toExist();
        await expect(component).toHaveAttribute("size", "lg");
        await expect(icon).toExist();
        await expect(titleText).toExist();
        await expect(body).toExist();
        await expect(actions).toExist();
    });

    it("should render a complex helper function call", async () => {
        const { component, icon, titleText, body, footer } = await provide(
            akEmptyState({
                loading: true,
                size: "sm",
                title: html`<h3>${msg("Loading Data")}</h3>`,
                body: html`<span>Please wait while we load your data</span>`,
                footer: html`<a href="#">Learn more about this process</a>`,
            }),
        );

        const spinner = await icon.$(">>>ak-spinner");
        await expect(component).toExist();
        await expect(component).toHaveAttribute("size", "sm");
        await expect(component).toHaveAttribute("loading");
        await expect(icon).toExist();
        await expect(spinner).toExist();
        await expect(titleText).toExist();
        await expect(body).toExist();
        await expect(footer).toExist();
    });
});
