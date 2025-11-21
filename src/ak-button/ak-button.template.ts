import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

interface ButtonProps {
    disabled: boolean;
    type?: string;
    name?: string;
    value?: string;
    onClick: (ev: MouseEvent) => void;
    onKeydown: (ev: KeyboardEvent) => void;
}

type ButtonLinkProps = Pick<ButtonProps, "disabled" | "onClick" | "onKeydown"> & {
    href: string;
    target?: string;
    rel?: string;
    download?: string;
};

export function linkTemplate(props: ButtonLinkProps) {
    const { href, target, disabled, download, rel, onClick, onKeydown } = props;
    return html`<a
        id="main"
        href=${href}
        part="anchor"
        target="${ifDefined(target)}"
        ?disabled=${disabled}
        download=${ifDefined(download)}
        rel=${ifDefined(rel)}
        tabindex=${disabled ? -1 : 0}
        @click=${onClick}
        @keydown=${onKeydown}
        ><slot></slot
    ></a>`;
}

export function buttonTemplate(props: ButtonProps) {
    const { disabled, type, name, value, onClick, onKeydown } = props;
    return html`<button
        id="main"
        part="button"
        ?disabled=${disabled}
        type=${ifDefined(type)}
        name=${ifDefined(name)}
        value=${ifDefined(value)}
        @click=${onClick}
        @keydown=${onKeydown}
    >
        <slot></slot>
    </button>`;
}
