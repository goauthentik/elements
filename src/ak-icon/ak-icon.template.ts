import { html } from "lit";

export const template = (icon: string) => html`<div part="content"><i part="icon" class="${icon}"></i></div>`;
