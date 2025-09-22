import "./ak-icon.js";

import { akIcon, Icon } from "./ak-icon.js";

import { $, browser, expect } from "@wdio/globals";

import { html, render, TemplateResult } from "lit";

describe("ak-icon component", () => {
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

    const provide = async (component: TemplateResult) => {
        const innerContainer = document.querySelector("#container");
        if (!(innerContainer && innerContainer instanceof HTMLElement)) {
            throw new Error("Unable to find container. /* CAN'T HAPPEN */");
        }
        render(component, innerContainer);
        await browser.pause(100);
        const icon = await container.$("ak-icon");
        const content = await icon.$('>>>[part="content"]');
        const part = await icon.$('>>>[part="icon"]');
        return { icon, content, part };
    };

    it("should render with fallback icon when no icon is provided", async () => {
        const { icon, part } = await provide(html`<ak-icon></ak-icon>`);
        await expect(icon).toExist();
        await expect(part).toExist();
        await expect(part).toHaveAttribute("class", "fa fa-bug");
    });

    it("should render with custom fallback", async () => {
        const { part } = await provide(html`<ak-icon fallback="fas fa-question"></ak-icon>`);
        await expect(part).toHaveAttribute("class", "fas fa-question");
    });

    it("should resolve alias correctly", async () => {
        const { part } = await provide(html`<ak-icon icon="user"></ak-icon>`);
        await expect(part).toHaveAttribute("class", "fas fa-user");
    });

    it("should handle explicit family and icon", async () => {
        const { part } = await provide(
            html`<ak-icon family="pf" icon="pf-icon-cluster"></ak-icon>`,
        );
        await expect(part).toHaveAttribute("class", "pf pf-icon-cluster");
    });

    it("should handle space-separated icon class", async () => {
        const { part } = await provide(html`<ak-icon icon="fas fa-home"></ak-icon>`);
        await expect(part).toHaveAttribute("class", "fas fa-home");
    });

    it("should fallback when alias resolution fails", async () => {
        const { part } = await provide(html`<ak-icon icon="nonexistent-icon"></ak-icon>`);
        await expect(part).toHaveAttribute("class", "fa fa-bug");
    });

    it("should update icon when property changes", async () => {
        const { icon, part } = await provide(html`<ak-icon icon="user"></ak-icon>`);

        await expect(part).toHaveAttribute("class", "fas fa-user");
        await icon.execute((elem) => {
            elem.setAttribute("icon", "home");
        });

        const newPart = await icon.$(">>>[part='icon']");
        await expect(newPart).toHaveAttribute("class", "fas fa-home");
    });

    it("should update when family changes", async () => {
        const { icon, part } = await provide(html`<ak-icon family="fas" icon="fa-user"></ak-icon>`);

        await expect(part).toHaveAttribute("class", "fas fa-user");

        await icon.execute((elem) => {
            elem.setAttribute("family", "fab");
        });

        const newPart = await icon.$(">>>[part='icon']");
        await expect(newPart).toHaveAttribute("class", "fab fa-user");
    });

    it("should handle PatternFly aliases", async () => {
        const { part } = await provide(html`<ak-icon icon="cluster"></ak-icon>`);
        await expect(part).toHaveAttribute("class", "pf pf-icon-cluster");
    });

    it("should prefer explicit family over alias resolution", async () => {
        const { part } = await provide(html`<ak-icon family="fab" icon="user"></ak-icon>`);
        await expect(part).toHaveAttribute("class", "fab user");
    });

    it("should apply size attribute to host", async () => {
        const { icon } = await provide(html`<ak-icon icon="user" size="lg"></ak-icon>`);
        await expect(icon).toHaveAttribute("size", "lg");
    });

    it("should apply variant attribute to host", async () => {
        const { icon } = await provide(
            html`<ak-icon icon="exclamation-triangle" variant="warning"></ak-icon>`,
        );
        await expect(icon).toHaveAttribute("variant", "warning");
    });

    it("should apply effect attribute to host", async () => {
        const { icon } = await provide(html`<ak-icon icon="spinner" effect="spin"></ak-icon>`);
        await expect(icon).toHaveAttribute("effect", "spin");
    });

    it("should expose correct CSS parts", async () => {
        const { content, part } = await provide(html`<ak-icon icon="user"></ak-icon>`);
        await expect(content).toExist();
        await expect(part).toExist();
    });

    it("should maintain property types when accessed programmatically", async () => {
        const { icon } = await provide(
            html`<ak-icon icon="user" family="fas" fallback="fa fa-question"></ak-icon>`,
        );

        const iconProperty = await icon.execute((elem) => (elem as Icon).icon);
        const familyProperty = await icon.execute((elem) => (elem as Icon).family);
        const fallbackProperty = await icon.execute((elem) => (elem as Icon).fallback);

        expect(iconProperty).toBe("user");
        expect(familyProperty).toBe("fas");
        expect(fallbackProperty).toBe("fa fa-question");
    });

    it("should re-derive icon class on property changes", async () => {
        const { icon, part } = await provide(html`<ak-icon icon="user"></ak-icon>`);

        await expect(part).toHaveAttribute("class", "fas fa-user");

        // Change both icon and family
        await icon.execute((elem) => {
            (elem as Icon).icon = "home";
            (elem as Icon).family = "pf";
        });

        await expect(part).toHaveAttribute("class", "pf home");
    });
});

describe("akIcon builder function", () => {
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
    const provide = async (component: TemplateResult) => {
        const innerContainer = document.querySelector("#container");
        if (!(innerContainer && innerContainer instanceof HTMLElement)) {
            throw new Error("Unable to find container. /* CAN'T HAPPEN */");
        }
        render(component, innerContainer);
        await browser.pause(100);
        const icon = await container.$("ak-icon");
        const content = await icon.$('>>>[part="content"]');
        const part = await icon.$('>>>[part="icon"]');
        return { icon, content, part };
    };

    it("should render using akIcon helper function", async () => {
        const { icon, part } = await provide(
            akIcon({
                icon: "user",
                size: "lg",
                variant: "info",
                effect: "beat",
            }),
        );

        await expect(icon).toExist();
        await expect(icon).toHaveAttribute("icon", "user");
        await expect(icon).toHaveAttribute("size", "lg");
        await expect(icon).toHaveAttribute("variant", "info");
        await expect(icon).toHaveAttribute("effect", "beat");
        await expect(part).toHaveAttribute("class", "fas fa-user");
    });

    it("should render with explicit family and icon via helper", async () => {
        const { icon, part } = await provide(
            akIcon({
                family: "pf",
                icon: "pf-icon-cluster",
                size: "xl",
            }),
        );

        await expect(icon).toHaveAttribute("family", "pf");
        await expect(icon).toHaveAttribute("icon", "pf-icon-cluster");
        await expect(icon).toHaveAttribute("size", "xl");
        await expect(part).toHaveAttribute("class", "pf pf-icon-cluster");
    });

    it("should render with custom fallback via helper", async () => {
        const { icon, part } = await provide(
            akIcon({
                icon: "nonexistent",
                fallback: "fas fa-exclamation",
            }),
        );
        await expect(icon).toHaveAttribute("fallback", "fas fa-exclamation");
        await expect(part).toHaveAttribute("class", "fas fa-exclamation");
    });

    it("should handle minimal configuration via helper", async () => {
        const { icon, part } = await provide(akIcon({ icon: "home" }));
        await expect(icon).toExist();
        await expect(icon).toHaveAttribute("icon", "home");
        await expect(part).toHaveAttribute("class", "fas fa-home");
    });

    it("should handle empty configuration via helper", async () => {
        const { icon, part } = await provide(akIcon({}));
        await expect(icon).toExist();
        await expect(part).toHaveAttribute("class", "fa fa-bug");
    });

    it("should render complex configuration via helper", async () => {
        const { icon, part } = await provide(
            akIcon({
                icon: "heart",
                family: "fas",
                size: "lg",
                variant: "danger",
                effect: "beat-fade",
                fallback: "fas fa-heart-crack",
            }),
        );

        await expect(icon).toHaveAttribute("icon", "heart");
        await expect(icon).toHaveAttribute("family", "fas");
        await expect(icon).toHaveAttribute("size", "lg");
        await expect(icon).toHaveAttribute("variant", "danger");
        await expect(icon).toHaveAttribute("effect", "beat-fade");
        await expect(icon).toHaveAttribute("fallback", "fas fa-heart-crack");
        await expect(part).toHaveAttribute("class", "fas heart");
    });
});
