import "./ak-switch.js";

import { akSwitch } from "./ak-switch.js";

import { $, browser, expect } from "@wdio/globals";

import { msg } from "@lit/localize";
import { html, render, type TemplateResult } from "lit";

describe("ak-switch component", () => {
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
        render(template, innerContainer);
        await browser.pause(100);

        const component = await container.$("ak-switch");
        return {
            component,
            switchPart: await component.$('>>>[part="switch"]'),
            toggle: await component.$('>>>[part="toggle"]'),
            toggleIcon: await component.$('>>>[part="toggle-icon"]'),
            label: await component.$('>>>[part="label"]'),
        };
    };

    describe("Basic functionality", () => {
        it("should render with default unchecked state", async () => {
            const { component, toggle } = await provide(html`<ak-switch></ak-switch>`);

            await expect(component).toExist();
            await expect(component).toHaveAttribute("role", "switch");
            await expect(component).toHaveElementProperty("checked", false);
            await expect(toggle).toExist();
        });

        it("should render in checked state when checked attribute is set", async () => {
            const { component } = await provide(html`<ak-switch checked></ak-switch>`);

            await expect(component).toHaveAttribute("checked");
            await expect(component).toHaveElementProperty("checked", true);
            await expect(component).toHaveAttribute("aria-checked", "true");
        });

        it("should toggle checked state when clicked", async () => {
            const { component } = await provide(html`<ak-switch></ak-switch>`);

            await expect(component).toHaveElementProperty("checked", false);

            await component.click();
            await browser.pause(50);

            await expect(component).toHaveElementProperty("checked", true);
            await expect(component).toHaveAttribute("aria-checked", "true");

            await component.click();
            await browser.pause(50);

            await expect(component).toHaveElementProperty("checked", false);
            await expect(component).toHaveAttribute("aria-checked", "false");
        });
    });

    describe("Disabled state", () => {
        it("should render as disabled when disabled attribute is set", async () => {
            const { component, switchPart } = await provide(html`<ak-switch disabled></ak-switch>`);

            await expect(component).toHaveAttribute("disabled");
            await expect(component).toHaveElementProperty("disabled", true);
            await expect(switchPart).toHaveAttribute("tabindex", "-1");
        });

        it("should not toggle when clicked while disabled", async () => {
            const { component } = await provide(html`<ak-switch disabled></ak-switch>`);

            await component.click();
            await browser.pause(50);

            await expect(component).toHaveElementProperty("checked", false);
        });
    });

    describe("Form integration", () => {
        it("should participate in form submission with correct name and value", async () => {
            await provide(html`
                <form id="test-form">
                    <ak-switch name="testSwitch" value="customValue" checked></ak-switch>
                </form>
            `);

            const formData = await browser.execute(() => {
                const form = document.getElementById("test-form") as HTMLFormElement;
                const data = new FormData(form);
                return Object.fromEntries(data.entries());
            });

            expect(formData.testSwitch).toBe("customValue");
        });

        it("should not submit value when unchecked", async () => {
            await provide(html`
                <form id="test-form">
                    <ak-switch name="testSwitch" value="customValue"></ak-switch>
                </form>
            `);

            const formData = await browser.execute(() => {
                const form = document.getElementById("test-form") as HTMLFormElement;
                const data = new FormData(form);
                return Object.fromEntries(data.entries());
            });

            expect(formData.testSwitch).toBeUndefined();
        });

        it("should use 'on' as default value when checked with no value attribute", async () => {
            await provide(html`
                <form id="test-form">
                    <ak-switch name="testSwitch" checked></ak-switch>
                </form>
            `);

            const formData = await browser.execute(() => {
                const form = document.getElementById("test-form") as HTMLFormElement;
                const data = new FormData(form);
                return Object.fromEntries(data.entries());
            });

            expect(formData.testSwitch).toBe("on");
        });

        it("should reset to default state when form is reset", async () => {
            const { component } = await provide(html`
                <form id="test-form">
                    <ak-switch name="testSwitch" checked></ak-switch>
                </form>
            `);

            // Toggle the switch
            await component.click();
            await browser.pause(50);
            await expect(component).toHaveElementProperty("checked", false);

            // Reset the form
            await browser.execute(() => {
                const form = document.getElementById("test-form") as HTMLFormElement;
                form.reset();
            });
            await browser.pause(50);

            // Should return to original checked state
            await expect(component).toHaveElementProperty("checked", true);
        });
    });

    describe("Validation", () => {
        it("should be invalid when required and unchecked", async () => {
            const { component } = await provide(html`<ak-switch required></ak-switch>`);

            // Interact with the component to trigger validation
            await component.click();
            await browser.pause(50);
            await component.click(); // Back to unchecked
            await browser.pause(50);

            const isValid = await browser.execute((el) => {
                return el.checkValidity();
            }, component);

            expect(isValid).toBe(false);
        });

        it("should be valid when required and checked", async () => {
            const { component } = await provide(html`<ak-switch required></ak-switch>`);

            await component.click(); // Check it
            await browser.pause(50);

            const isValid = await browser.execute((el) => {
                return el.checkValidity();
            }, component);

            expect(isValid).toBe(true);
        });
    });

    describe("Events", () => {
        it("should fire change event when toggled", async () => {
            await browser.execute(() => {
                window.changeEventDetail = null;
                // eslint-disable-next-line sonarjs/no-nested-functions
                document.addEventListener("change", (e) => {
                    window.changeEventDetail = (e as CustomEvent).detail;
                });
            });

            const { component } = await provide(
                html`<ak-switch name="test" value="testValue"></ak-switch>`
            );

            await component.click();
            await browser.pause(50);

            const eventDetail = await browser.execute(() => window.changeEventDetail);
            expect(eventDetail.checked).toBe(true);
            expect(eventDetail.value).toBe("testValue");
        });
    });

    describe("Slots and content", () => {
        it("should render label content in label slot", async () => {
            const { label } = await provide(html`
                <ak-switch>
                    <span slot="label">Test Label</span>
                </ak-switch>
            `);

            await expect(label).toExist();
            const labelSlot = await label.$(">>>slot[name='label']");
            await expect(labelSlot).toExist();
        });

        it("should render label-on content when checked", async () => {
            const { label } = await provide(html`
                <ak-switch checked>
                    <span slot="label">Off Text</span>
                    <span slot="label-on">On Text</span>
                </ak-switch>
            `);

            await expect(label).toExist();
            const labelOnSlot = await label.$(">>>slot[name='label-on']");
            await expect(labelOnSlot).toExist();
        });

        it("should render custom icon in icon slot", async () => {
            const { toggleIcon } = await provide(html`
                <ak-switch>
                    <div slot="icon">Custom Icon</div>
                </ak-switch>
            `);

            await expect(toggleIcon).toExist();
            const iconSlot = await toggleIcon.$(">>>slot[name='icon']");
            await expect(iconSlot).toExist();
        });

        it("should render check icon when use-check is true", async () => {
            const { toggleIcon } = await provide(html`<ak-switch use-check></ak-switch>`);

            await expect(toggleIcon).toExist();
            const checkIcon = await toggleIcon.$(">>>ak-icon");
            await expect(checkIcon).toExist();
        });
    });

    describe("Accessibility", () => {
        it("should have proper ARIA attributes", async () => {
            const { component } = await provide(html`<ak-switch></ak-switch>`);

            await expect(component).toHaveAttribute("role", "switch");
            await expect(component).toHaveAttribute("aria-checked", "false");
        });

        it("should update aria-checked when state changes", async () => {
            const { component } = await provide(html`<ak-switch></ak-switch>`);
            await expect(component).toHaveAttribute("aria-checked", "false");

            await component.click();
            await browser.pause(50);

            await expect(component).toHaveAttribute("aria-checked", "true");
        });

        it("should set aria-disabled when disabled", async () => {
            const { component } = await provide(html`<ak-switch disabled></ak-switch>`);
            await browser.pause(50);
            await expect(component).toHaveAttribute("aria-disabled", "true");
        });

        it("should connect to external label via aria-labelledby", async () => {
            const { component } = await provide(html`
                <label id="switch-label" for="test-switch">External Label</label>
                <ak-switch id="test-switch"></ak-switch>
            `);

            await browser.pause(100); // Allow label association to be processed

            const ariaLabelledBy = await component.getAttribute("aria-labelledby");
            expect(ariaLabelledBy).toBe("switch-label");
        });

        it("should be focusable when enabled", async () => {
            const { switchPart } = await provide(html`<ak-switch></ak-switch>`);
            await expect(switchPart).toHaveAttribute("tabindex", "0");
        });

        it("should not be focusable when disabled", async () => {
            const { switchPart } = await provide(html`<ak-switch disabled></ak-switch>`);
            await expect(switchPart).toHaveAttribute("tabindex", "-1");
        });
    });

    describe("Label activation", () => {
        it("should toggle when associated label is clicked", async () => {
            const { component } = await provide(html`
                <label for="test-switch">Click me</label>
                <ak-switch id="test-switch"></ak-switch>
            `);

            const label = await container.$("label");
            await label.click();
            await browser.pause(50);

            await expect(component).toHaveElementProperty("checked", true);
        });
    });
});

describe("akSwitch builder function", () => {
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
        render(template, innerContainer);
        await browser.pause(100);

        const component = await container.$("ak-switch");
        return {
            component,
            toggle: await component.$('>>>[part="toggle"]'),
            label: await component.$('>>>[part="label"]'),
        };
    };

    it("should render using akSwitch helper function", async () => {
        const { component } = await provide(
            akSwitch({
                name: "testSwitch",
                checked: true,
                value: "testValue",
                ariaLabel: "Test switch",
            })
        );

        await expect(component).toExist();
        await expect(component).toHaveAttribute("name", "testSwitch");
        await expect(component).toHaveElementProperty("checked", true);
        await expect(component).toHaveAttribute("value", "testValue");
        await expect(component).toHaveAttribute("aria-label", "Test switch");
    });

    it("should handle boolean properties correctly", async () => {
        const { component } = await provide(
            akSwitch({
                required: true,
                disabled: false,
                useCheck: true,
            })
        );

        await expect(component).toHaveAttribute("required");
        await expect(component).not.toHaveAttribute("disabled");
        await expect(component).toHaveAttribute("use-check");
    });
});
