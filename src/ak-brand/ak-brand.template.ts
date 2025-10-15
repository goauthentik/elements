import type { IBrand } from "./ak-brand.types.js";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export const template = ({ src, alt }: IBrand) =>
    html`<img part="brand" loading="lazy" src=${ifDefined(src)} alt=${ifDefined(alt)} />`;
