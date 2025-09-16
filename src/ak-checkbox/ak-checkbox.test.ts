import "./ak-checkbox.js";

import { akCheckbox } from "./ak-checkbox.js";

import { $, browser, expect } from "@wdio/globals";

import { html, render, type TemplateResult } from "lit";

describe("ak-checkbox component", () => {
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
        const component = await container.$("ak-checkbox");
        return {
            component,
            checkboxPart: await component.$('>>>[part="checkbox"]'),
            toggle: await component.$('>>>[part="toggle"]'),
            label: await component.$('>>>[part="label"]'),
        };
    };

    describe("Basic functionality", () => {
        it("should render with default unchecked state", async () => {
            const { component, toggle } = await provide(html`<ak-checkbox></ak-checkbox>`);

            await expect(component).toExist();
            await expect(component).toHaveAttribute("role", "checkbox");
            await expect(component).toHaveElementProperty("checked", false);
            await expect(toggle).toExist();
        });

        it("should render in checked state when checked attribute is set", async () => {
            const { component, toggle } = await provide(html`<ak-checkbox checked></ak-checkbox>`);

            await expect(component).toHaveAttribute("checked");
            await expect(component).toHaveElementProperty("checked", true);
            await expect(component).toHaveAttribute("aria-checked", "true");

            // Should show checkmark icon
            const svg = await toggle.$("svg");
            await expect(svg).toExist();
        });

        it("should not show checkmark when unchecked", async () => {
            const { toggle } = await provide(html`<ak-checkbox></ak-checkbox>`);

            // Should not show checkmark icon
            const svg = await toggle.$(">>>svg");
            await expect(svg).not.toExist();
        });

        it("should toggle checked state when clicked", async () => {
            const { component } = await provide(html`<ak-checkbox></ak-checkbox>`);

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
            const { component, checkboxPart } = await provide(
                html`<ak-checkbox disabled></ak-checkbox>`,
            );

            await expect(component).toHaveAttribute("disabled");
            await expect(component).toHaveElementProperty("disabled", true);
            await expect(checkboxPart).toHaveAttribute("tabindex", "-1");
        });

        it("should not toggle when clicked while disabled", async () => {
            const { component } = await provide(html`<ak-checkbox disabled></ak-checkbox>`);

            await component.click();
            await browser.pause(50);

            await expect(component).toHaveElementProperty("checked", false);
        });
    });

    describe("Form integration", () => {
        it("should participate in form submission with correct name and value", async () => {
            await provide(html`
                <form id="test-form">
                    <ak-checkbox name="testCheckbox" value="customValue" checked></ak-checkbox>
                </form>
            `);

            const formData = await browser.execute(() => {
                const form = document.getElementById("test-form") as HTMLFormElement;
                const data = new FormData(form);
                return Object.fromEntries(data.entries());
            });

            expect(formData.testCheckbox).toBe("customValue");
        });

        it("should not submit value when unchecked", async () => {
            await provide(html`
                <form id="test-form">
                    <ak-checkbox name="testCheckbox" value="customValue"></ak-checkbox>
                </form>
            `);

            const formData = await browser.execute(() => {
                const form = document.getElementById("test-form") as HTMLFormElement;
                const data = new FormData(form);
                return Object.fromEntries(data.entries());
            });

            expect(formData.testCheckbox).toBeUndefined();
        });

        it("should use 'on' as default value when checked with no value attribute", async () => {
            await provide(html`
                <form id="test-form">
                    <ak-checkbox name="testCheckbox" checked></ak-checkbox>
                </form>
            `);

            const formData = await browser.execute(() => {
                const form = document.getElementById("test-form") as HTMLFormElement;
                const data = new FormData(form);
                return Object.fromEntries(data.entries());
            });

            expect(formData.testCheckbox).toBe("on");
        });

        it("should reset to default state when form is reset", async () => {
            const { component } = await provide(html`
                <form id="test-form">
                    <ak-checkbox name="testCheckbox" checked></ak-checkbox>
                </form>
            `);

            // Toggle the checkbox
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
            const { component } = await provide(html`<ak-checkbox required></ak-checkbox>`);

            // Interact with the component to trigger validation
            await component.click();
            await browser.pause(50);
            await component.click(); // Back to unchecked
            await browser.pause(50);

            const isValid = await browser.execute((el) => {
                return (el as HTMLInputElement).checkValidity();
            }, component);

            expect(isValid).toBe(false);
        });

        it("should be valid when required and checked", async () => {
            const { component } = await provide(html`<ak-checkbox required></ak-checkbox>`);

            await component.click(); // Check it
            await browser.pause(50);

            const isValid = await browser.execute((el) => {
                return (el as HTMLInputElement).checkValidity();
            }, component);

            expect(isValid).toBe(true);
        });

        it("should be valid when not required regardless of state", async () => {
            const { component } = await provide(html`<ak-checkbox></ak-checkbox>`);

            const isValid = await browser.execute((el) => {
                return (el as HTMLInputElement).checkValidity();
            }, component);

            expect(isValid).toBe(true);
        });
    });

    describe("Events", () => {
        it("should fire change event when toggled", async () => {
            await browser.execute(() => {
                // @ts-expect-error scratchpad
                window.changeEventDetail = null;
                // eslint-disable-next-line sonarjs/no-nested-functions
                document.addEventListener("change", (e) => {
                    // @ts-expect-error scratchpad
                    window.changeEventDetail = (e as CustomEvent).detail;
                });
            });

            const { component } = await provide(
                html`<ak-checkbox name="test" value="testValue"></ak-checkbox>`,
            );

            await component.click();
            await browser.pause(50);

            // @ts-expect-error scratchpad
            const eventDetail = await browser.execute(() => window.changeEventDetail);
            expect(eventDetail.checked).toBe(true);
            expect(eventDetail.value).toBe("testValue");
        });

        it("should fire change event with correct data when unchecking", async () => {
            await browser.execute(() => {
                // @ts-expect-error scratchpad
                window.changeEventDetail = null;
                // eslint-disable-next-line sonarjs/no-nested-functions
                document.addEventListener("change", (e) => {
                    // @ts-expect-error scratchpad
                    window.changeEventDetail = (e as CustomEvent).detail;
                });
            });

            const { component } = await provide(
                html`<ak-checkbox name="test" value="testValue" checked></ak-checkbox>`,
            );

            await component.click(); // Uncheck
            await browser.pause(50);

            // @ts-expect-error scratchpad
            const eventDetail = await browser.execute(() => window.changeEventDetail);
            expect(eventDetail.checked).toBe(false);
            expect(eventDetail.value).toBe("testValue");
        });
    });

    describe("Slots and content", () => {
        it("should render label content in label slot", async () => {
            const { label } = await provide(html`
                <ak-checkbox>
                    <span slot="label">Test Label</span>
                </ak-checkbox>
            `);

            await expect(label).toExist();
            const labelSlot = await label.$(">>>slot[name='label']");
            await expect(labelSlot).toExist();
        });

        it("should render label-on content when checked", async () => {
            const { label } = await provide(html`
                <ak-checkbox checked>
                    <span slot="label">Unchecked Text</span>
                    <span slot="label-on">Checked Text</span>
                </ak-checkbox>
            `);

            await expect(label).toExist();
            const labelOnSlot = await label.$(">>>slot[name='label-on']");
            await expect(labelOnSlot).toExist();
        });

        it("should render default label when unchecked even with label-on slot", async () => {
            const { label } = await provide(html`
                <ak-checkbox>
                    <span slot="label">Unchecked Text</span>
                    <span slot="label-on">Checked Text</span>
                </ak-checkbox>
            `);

            await expect(label).toExist();
            const labelSlot = await label.$(">>>slot[name='label']");
            await expect(labelSlot).toExist();
        });

        it("should render checkbox without label when no label slot provided", async () => {
            const { label } = await provide(html`<ak-checkbox></ak-checkbox>`);

            // Label part should not exist when no label content
            await expect(label).not.toExist();
        });
    });

    describe("Layout and positioning", () => {
        it("should support reverse layout", async () => {
            const { component, toggle, label } = await provide(html`
                <ak-checkbox reverse>
                    <span slot="label">Reversed Label</span>
                </ak-checkbox>
            `);

            await expect(component).toHaveAttribute("reverse");
            await expect(toggle).toExist();
            await expect(label).toExist();
        });
    });

    describe("Accessibility", () => {
        it("should have proper ARIA attributes", async () => {
            const { component } = await provide(html`<ak-checkbox></ak-checkbox>`);

            await expect(component).toHaveAttribute("role", "checkbox");
            await expect(component).toHaveAttribute("aria-checked", "false");
        });

        it("should update aria-checked when state changes", async () => {
            const { component } = await provide(html`<ak-checkbox></ak-checkbox>`);

            await component.click();
            await browser.pause(50);

            await expect(component).toHaveAttribute("aria-checked", "true");
        });

        it("should set aria-disabled when disabled", async () => {
            const { component } = await provide(html`<ak-checkbox disabled></ak-checkbox>`);

            // Check if aria-disabled is set via ElementInternals
            const ariaDisabled = await browser.execute((el) => {
                return el.getAttribute("aria-disabled");
            }, component);

            expect(ariaDisabled).toBe("true");
        });

        it("should connect to external label via aria-labelledby", async () => {
            const { component } = await provide(html`
                <label id="checkbox-label" for="test-checkbox">External Label</label>
                <ak-checkbox id="test-checkbox"></ak-checkbox>
            `);

            await browser.pause(100); // Allow label association to be processed

            const ariaLabelledBy = await component.getAttribute("aria-labelledby");
            expect(ariaLabelledBy).toBe("checkbox-label");
        });

        it("should be focusable when enabled", async () => {
            const { checkboxPart } = await provide(html`<ak-checkbox></ak-checkbox>`);

            await expect(checkboxPart).toHaveAttribute("tabindex", "0");
        });

        it("should not be focusable when disabled", async () => {
            const { checkboxPart } = await provide(html`<ak-checkbox disabled></ak-checkbox>`);

            await expect(checkboxPart).toHaveAttribute("tabindex", "-1");
        });
    });

    describe("Label activation", () => {
        it("should toggle when associated label is clicked", async () => {
            const { component } = await provide(html`
                <label for="test-checkbox">Click me</label>
                <ak-checkbox id="test-checkbox"></ak-checkbox>
            `);

            const label = await container.$("label");
            await label.click();
            await browser.pause(50);

            await expect(component).toHaveElementProperty("checked", true);
        });
    });

    describe("Visual states", () => {
        it("should show checkmark icon only when checked", async () => {
            const { component, toggle } = await provide(html`<ak-checkbox></ak-checkbox>`);

            // Initially unchecked - no icon
            const svg = await toggle.$(">>>svg");
            await expect(svg).not.toExist();

            // Click to check
            await component.click();
            await browser.pause(50);

            await expect(svg).toExist();

            // Verify it's the check icon (has the expected path)
            const path = await svg.$(">>>path");
            await expect(path).toExist();
        });
    });
});

describe("akCheckbox builder function", () => {
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

        const component = await container.$("ak-checkbox");
        return {
            component,
            toggle: await component.$('>>>[part="toggle"]'),
            label: await component.$('>>>[part="label"]'),
        };
    };

    it("should render using akCheckbox helper function", async () => {
        const { component } = await provide(
            akCheckbox({
                name: "testCheckbox",
                checked: true,
                value: "testValue",
                ariaLabel: "Test checkbox",
            }),
        );

        await expect(component).toExist();
        await expect(component).toHaveAttribute("name", "testCheckbox");
        await expect(component).toHaveElementProperty("checked", true);
        await expect(component).toHaveAttribute("value", "testValue");
        await expect(component).toHaveAttribute("aria-label", "Test checkbox");
    });

    it("should handle boolean properties correctly", async () => {
        const { component } = await provide(
            akCheckbox({
                required: true,
                disabled: false,
                reverse: true,
            }),
        );

        await expect(component).toHaveAttribute("required");
        await expect(component).not.toHaveAttribute("disabled");
        await expect(component).toHaveAttribute("reverse");
    });

    it("should render with label content", async () => {
        const { component, label } = await provide(
            akCheckbox({
                label: "Test Label",
            }),
        );

        await expect(component).toExist();
        await expect(label).toExist();
    });
});
