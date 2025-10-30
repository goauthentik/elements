import { schedule } from "../utils/schedule.js";
import { DEFAULT_THEME, type Theme, themeContext } from "./themeContext.js";
import { ThemeMediaHandler } from "./themeMediaHandler.js";

import { ContextProvider } from "@lit/context";
import { LitElement, ReactiveController, ReactiveControllerHost } from "lit";

type HostElement = ReactiveControllerHost & LitElement;

const THEME_ATTRIBUTE = "theme";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTheme = (v: any): v is Theme => v === "light" || v === "dark";

// MutationRecord doesn't supply "newMutationValue". Sadly. The `as string` is necessary here
// because it's not possible for Typescript to distinguish between AttributeMutationRecords, which
// will always have an attribute name, and ChildlistMutationRecords, where it will always be null.
const getMutationValue = (mutation: MutationRecord) =>
    (mutation.target as HTMLElement).getAttribute(mutation.attributeName as string);

export class ThemeProvider extends ThemeMediaHandler implements ReactiveController {
    #theme: Theme = DEFAULT_THEME;
    #provider: ContextProvider<typeof themeContext> | null = null;
    #observer: MutationObserver | null = null;
    #host: HostElement;
    #hasAttributeSetting = false;

    public get theme() {
        return this.#theme;
    }

    private set theme(theme: Theme) {
        this.#theme = theme;
        this.#provider?.setValue(theme);
    }

    constructor(host: HostElement) {
        super();
        this.#host = host;
        host.addController(this);
    }

    protected checkAndUpdateTheme(theme: Theme) {
        if (theme !== this.#theme) {
            this.theme = theme;
            this.#host.requestUpdate();
        }
    }

    // POLICY: Setting the attribute `<html theme="dark">` will always take priority over the
    // browser preferences.

    #onAttributeChange = (mutations: MutationRecord[]) => {
        // It's possible to get multiple mutations in a single pass; in this case,
        // we want only to process the last one.
        const lastValidMutation = mutations
            .filter((mutation) => mutation.oldValue !== getMutationValue(mutation))
            .pop();
        if (!lastValidMutation) {
            return;
        }
        const theme = getMutationValue(lastValidMutation);

        // Someone deleted the attribute on `document.documentElement` (i.e. `<html>`). Revert to
        // media-query monitoring.
        if (theme === null && !this.hasActiveMediaQuery) {
            this.#hasAttributeSetting = false;
            this.connectMediaQuery();
            return;
        }

        if (isTheme(theme)) {
            this.theme = theme;
            this.#hasAttributeSetting = true;
            this.disconnectMediaQuery();
        }
    };

    hostConnected() {
        const theme = document.documentElement.getAttribute(THEME_ATTRIBUTE);
        if (isTheme(theme)) {
            this.#hasAttributeSetting = true;
            this.#theme = theme;
        }

        this.#provider = new ContextProvider(this.#host, {
            context: themeContext,
            initialValue: this.#theme,
        });

        this.#observer = new MutationObserver(this.#onAttributeChange);
        this.#observer.observe(document.documentElement, {
            attributeFilter: [THEME_ATTRIBUTE],
            attributeOldValue: true,
            childList: false,
        });

        schedule(() => {
            if (!this.#hasAttributeSetting) {
                this.connectMediaQuery();
            }
        });
    }

    hostDisconnected() {
        this.disconnectMediaQuery();
        this.#observer?.disconnect();
        this.#observer = null;
        this.#provider = null;
    }
}
