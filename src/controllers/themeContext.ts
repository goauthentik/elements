import { createContext } from "@lit/context";

export type Theme = "light" | "dark";

// Define the theme context key (shared across your app)
export const themeContext = createContext<Theme>(Symbol.for("theme-context"));

export const DEFAULT_THEME: Theme = "light";
