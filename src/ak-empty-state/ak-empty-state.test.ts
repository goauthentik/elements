import "./ak-empty-state.js";

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-lit";
import { Locator, locators, page } from "vitest/browser";

import { msg } from "@lit/localize";
import { html } from "lit";

locators.extend({
    getElement() {
        return "ak-empty-state";
    },
    getContent() {
        return 'ak-empty-state >> [part="content"]';
    },
    getIcon() {
        return 'ak-empty-state >> div[part="icon"]';
    },
    getAkIcon() {
        return "ak-empty-state >> ak-icon";
    },
    getIconSlot() {
        return 'ak-empty-state >> slot[name="icon"]';
    },
    getTitle() {
        return 'ak-empty-state >> [part="title"]';
    },
    getBody() {
        return 'ak-empty-state >> [part="body"]';
    },
    getFooter() {
        return 'ak-empty-state >> [part="footer"]';
    },
    getActions() {
        return 'ak-empty-state >> [part="actions"]';
    },
    getSpinner() {
        return "ak-empty-state >> ak-spinner";
    },
});

declare module "vitest/browser" {
    interface LocatorSelectors {
        getElement(): Locator;
        getContent(): Locator;
        getIcon(): Locator;
        getAkIcon(): Locator;
        getIconSlot(): Locator;
        getTitle(): Locator;
        getBody(): Locator;
        getFooter(): Locator;
        getActions(): Locator;
    }
}

describe("ak-empty-state component", () => {
    it("should render with the default icon", async () => {
        render(
            html`<ak-empty-state>
                <h2 slot="title">${msg("No results found")}</h2>
            </ak-empty-state>`,
        );

        const icon = page.getAkIcon();
        await expect.element(icon).toBeVisible();
        await expect.element(icon).toHaveAttribute("icon", "fa fa-cubes");
    });

    it("should render a loading spinner when loading is true", async () => {
        render(
            html`<ak-empty-state loading>
                <h2 slot="title">${msg("Loading content")}</h2>
            </ak-empty-state>`,
        );

        const spinner = await page.getSpinner();
        const body = await page.getBody();
        await expect.element(spinner).toBeVisible();
        await expect.element(body).toBeVisible();
        await expect.element(body).toHaveTextContent("Loading...");
    });

    it("should not render an icon when text-only is true", async () => {
        render(
            html`<ak-empty-state text-only>
                <h2 slot="title">${msg("No results found")}</h2>
            </ak-empty-state>`,
        );

        const icon = page.getIcon();
        const slot = page.getIconSlot();
        await expect.element(slot).not.toBeInTheDocument();

        const title = page.getTitle();
        await expect.element(icon).not.toBeInTheDocument();
        await expect.element(title).toBeInTheDocument();
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
        );

        const iconSlot = await page.getIconSlot();
        await expect.element(iconSlot).toBeInTheDocument();
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
        );

        const iconSlot = await page.getIconSlot();
        await expect.element(iconSlot).toBeInTheDocument();
    });
});
