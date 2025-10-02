import { ifDefined } from "lit/directives/if-defined.js";
import { html } from "lit";
import type { INotificationCounter } from "./ak-notification-counter.types.js";

export const template = ({ src, alt }: INotificationCounter) =>
    html`<img part="notification-counter" loading="lazy" src=${ifDefined(src)} alt=${ifDefined(alt)} />`;
