import { type Theme } from "./themeContext.js";

export abstract class ThemeMediaHandler {
    #mediaQuery: MediaQueryList | null = null;
    #mediaQueryAbort: AbortController | null = null;

    protected abstract checkAndUpdateTheme(theme: Theme): void;

    protected onMediaQuery = (ev: MediaQueryListEvent) => {
        this.checkAndUpdateTheme(ev.matches ? "dark" : "light");
    };

    protected get hasActiveMediaQuery() {
        return Boolean(this.#mediaQuery && this.#mediaQueryAbort);
    }

    protected connectMediaQuery() {
        if (this.#mediaQueryAbort) {
            this.#mediaQueryAbort.abort();
        }
        this.#mediaQueryAbort = new AbortController();
        const { signal } = this.#mediaQueryAbort;
        this.#mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const newTheme = this.#mediaQuery.matches ? "dark" : "light";
        this.#mediaQuery.addEventListener("change", this.onMediaQuery, { signal });
        this.checkAndUpdateTheme(newTheme);
    }

    protected disconnectMediaQuery() {
        if (this.hasActiveMediaQuery) {
            this.#mediaQueryAbort?.abort();
            this.#mediaQueryAbort = null;
            this.#mediaQuery = null;
        }
    }
}
