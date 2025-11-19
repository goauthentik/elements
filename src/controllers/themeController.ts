import { schedule } from "../utils/schedule.js";
import { DEFAULT_THEME, type Theme, themeContext } from "./themeContext.js";
import { ThemeMediaHandler } from "./themeMediaHandler.js";

import { ContextConsumer } from "@lit/context";
import { LitElement, ReactiveController, ReactiveControllerHost } from "lit";

type HostElement = ReactiveControllerHost & LitElement;

export class ThemeController extends ThemeMediaHandler implements ReactiveController {
    #host: HostElement;

    #contextConsumer: ContextConsumer<typeof themeContext, HostElement> | null = null;
    #theme: Theme = DEFAULT_THEME;
    #hasContextProvider = false;

    get theme() {
        return this.#theme;
    }

    get hasContext() {
        return this.#hasContextProvider;
    }

    constructor(host: HostElement) {
        super();
        this.#host = host;
        host.addController(this);
    }

    protected checkAndUpdateTheme(theme: Theme) {
        if (theme !== this.#theme) {
            this.#theme = theme;
            this.#host.requestUpdate();
            this.disconnectMediaQuery();
        }
    }

    #onThemeContextChange = (value: Theme) => {
        this.#hasContextProvider = true;
        this.checkAndUpdateTheme(value);
    };

    hostConnected() {
        if (!this.#contextConsumer) {
            this.#contextConsumer = new ContextConsumer(this.#host, {
                context: themeContext,
                callback: this.#onThemeContextChange,
                subscribe: true,
            });
        }

        schedule(() => {
            if (!this.#hasContextProvider) {
                this.connectMediaQuery();
            }
        });
    }

    hostDisconnected() {
        this.disconnectMediaQuery();
    }
}
