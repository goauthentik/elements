import "./ak-notification-badge.js";

import { akNotificationBadge, NotificationBadge } from "./ak-notification-badge.js";

import { $, browser, expect } from "@wdio/globals";

import { msg } from "@lit/localize";
import { html, render, type TemplateResult } from "lit";

describe("ak-notification-badge component", () => {
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

        const component = await container.$("ak-notification-badge");
        return {
            component,
            badge: await component.$('>>>[part="notification-badge"]'),
            icon: await component.$('>>>[part="icon"]'),
            count: await component.$('>>>[part="count"]'),
        };
    };

    it("should render with default icon and no count when count is 0", async () => {
        const { badge, icon, count } = await provide(
            html`<ak-notification-badge></ak-notification-badge>`
        );

        await expect(badge).toExist();
        await expect(icon).toExist();
        await expect(count).not.toExist();

        const defaultIcon = await icon.$(">>>ak-icon");
        await expect(defaultIcon).toExist();
        await expect(defaultIcon).toHaveAttribute("icon", "bell");
    });

    it("should display count when greater than 0", async () => {
        const { count } = await provide(
            html`<ak-notification-badge count="5"></ak-notification-badge>`
        );

        await expect(count).toExist();
        await expect(count).toHaveText("5");
    });

    it("should hide count when it returns to 0", async () => {
        const { component, count } = await provide(
            html`<ak-notification-badge count="3"></ak-notification-badge>`
        );

        await expect(count).toExist();
        await expect(count).toHaveText("3");

        await component.execute((elem) => {
            (elem as NotificationBadge).count = 0;
        });
        await browser.pause(50);

        await expect(count).not.toExist();
    });

    it("should clamp negative counts to 0", async () => {
        const { component, count } = await provide(
            html`<ak-notification-badge count="-5"></ak-notification-badge>`
        );

        await expect(count).not.toExist();

        const actualCount = await component.execute((elem) => (elem as NotificationBadge).count);
        expect(actualCount).toBe(0);
    });

    it("should have correct ARIA label for count 0", async () => {
        const { component } = await provide(
            html`<ak-notification-badge count="0"></ak-notification-badge>`
        );

        await expect(component).toHaveAttribute("aria-label", msg("No unread notifications"));
    });

    it("should have correct ARIA label for count 1", async () => {
        const { component } = await provide(
            html`<ak-notification-badge count="1"></ak-notification-badge>`
        );

        await expect(component).toHaveAttribute("aria-label", msg("One unread notification"));
    });

    it("should have correct ARIA label for count > 1", async () => {
        const { component } = await provide(
            html`<ak-notification-badge count="7"></ak-notification-badge>`
        );

        await expect(component).toHaveAttribute("aria-label", "7 unread notifications");
    });

    it("should update ARIA label when count changes", async () => {
        const { component } = await provide(
            html`<ak-notification-badge count="3"></ak-notification-badge>`
        );

        await expect(component).toHaveAttribute("aria-label", "3 unread notifications");

        await component.execute((elem) => {
            (elem as NotificationBadge).count = 10;
        });
        await browser.pause(50);

        await expect(component).toHaveAttribute("aria-label", "10 unread notifications");
    });

    it("should update ARIA label when count changes to 0", async () => {
        const { component } = await provide(
            html`<ak-notification-badge count="5"></ak-notification-badge>`
        );

        await expect(component).toHaveAttribute("aria-label", "5 unread notifications");

        await component.execute((elem) => {
            (elem as NotificationBadge).count = 0;
        });
        await browser.pause(50);

        await expect(component).toHaveAttribute("aria-label", msg("No unread notifications"));
    });

    it("should use custom notifier function", async () => {
        const { component } = await provide(html`<ak-notification-badge></ak-notification-badge>`);

        await component.execute((elem) => {
            (elem as NotificationBadge).notifier = (count) => `Custom: ${count} items`;
            (elem as NotificationBadge).count = 3;
        });
        await browser.pause(50);

        await expect(component).toHaveAttribute("aria-label", "Custom: 3 items");
    });

    it("should have role=button and tabindex=0 by default", async () => {
        const { badge } = await provide(html`<ak-notification-badge></ak-notification-badge>`);

        await expect(badge).toHaveAttribute("role", "button");
        await expect(badge).toHaveAttribute("tabindex", "0");
    });

    it("should set tabindex=-1 when disabled", async () => {
        const { badge } = await provide(
            html`<ak-notification-badge disabled></ak-notification-badge>`
        );

        await expect(badge).toHaveAttribute("tabindex", "-1");
    });

    it("should dispatch click event when clicked", async () => {
        const { component, badge } = await provide(
            html`<ak-notification-badge></ak-notification-badge>`
        );

        let clickFired = false;
        await component.execute((elem) => {
            elem.addEventListener("click", () => {
                clickFired = true;
            });
        });

        await badge.click();
        await browser.pause(50);

        const result = await component.execute(() => clickFired);
        expect(result).toBe(true);
    });

    it("should dispatch click event on Enter key", async () => {
        const { component, badge } = await provide(
            html`<ak-notification-badge></ak-notification-badge>`
        );

        let clickFired = false;
        await component.execute((elem) => {
            elem.addEventListener("click", () => {
                clickFired = true;
            });
        });

        await badge.click(); // Focus the element
        await browser.keys(["Enter"]);
        await browser.pause(50);

        const result = await component.execute(() => clickFired);
        expect(result).toBe(true);
    });

    it("should dispatch click event on Space key", async () => {
        const { component, badge } = await provide(
            html`<ak-notification-badge></ak-notification-badge>`
        );

        let clickFired = false;
        await component.execute((elem) => {
            elem.addEventListener("click", () => {
                clickFired = true;
            });
        });

        await badge.click(); // Focus the element
        await browser.keys([" "]);
        await browser.pause(50);

        const result = await component.execute(() => clickFired);
        expect(result).toBe(true);
    });
});
