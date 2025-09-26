import { ifDefined } from "lit/directives/if-defined.js";
import { html } from "lit";
import type { IBrand } from "./ak-brand.types.js";

export const template = ({ src, alt }: IBrand) =>
    html`<img part="brand" loading="lazy" src=${ifDefined(src)} alt=${ifDefined(alt)} />`;
