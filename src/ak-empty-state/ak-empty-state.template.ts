import { match, P } from "ts-pattern";
import { msg } from "@lit/localize";
import { html, nothing } from "lit";

export const emptyStateSizes = ["xs", "sm", "md", "lg", "xl"] as const;
export type EmptyStateSize = (typeof emptyStateSizes)[number];
const DEFAULT_SIZE_INDEX = emptyStateSizes.indexOf("md");
const isEmptyStateSize = (s?: string): s is EmptyStateSize =>
    typeof s === "string" && s.trim() !== "" && emptyStateSizes.includes(s as EmptyStateSize);

const spinnerSizes = ["md", "lg", "lg", "xl", "xl"];
const iconSizes = ["sm", "md", "lg", "xl", "6x"];

function iconTemplate(
    useSlot: boolean,
    icon: string | undefined,
    skipIcon: boolean,
    isLoading: boolean,
    size: EmptyStateSize
) {
    if (useSlot) {
        return html`<div part="icon"><slot name="icon"></slot></div>`;
    }
    if (icon) {
        return html`<div part="icon"><ak-icon icon=${icon}></ak-icon></div>`;
    }
    if (skipIcon) {
        return nothing;
    }

    // Render the default icon, depending on the state. The size check is only to make sure the
    // subordinate components get legitimate sizes *from this component*; it's not meant as a
    // check that the size passed in is valid.
    const index = isEmptyStateSize(size) ? emptyStateSizes.indexOf(size) : DEFAULT_SIZE_INDEX;

    return isLoading
        ? html`<div part="icon">
              <ak-spinner size=${spinnerSizes[index] ?? "xl"}></ak-spinner>
          </div>`
        : html`<div part="icon">
              <ak-icon icon="fa fa-cubes" size="${iconSizes[index] ?? "3x"}"></ak-icon>
          </div>`;
}

const bodyTemplate = (useSlot: boolean, showLoading: boolean) =>
    match([useSlot, showLoading])
        .with([true, P._], () => html`<div part="body"><slot name="body"></slot></div>`)
        .with([false, true], () => html`<div part="body">${msg("Loading...")}</div>`)
        .otherwise(() => nothing);

const actionsTemplate = (has: boolean) =>
    has
        ? html`<div part="actions">
              <slot name="actions"></slot>
          </div>`
        : nothing;

const secondaryActionsTemplate = (has: boolean) =>
    has
        ? html`<div part="actions">
              <slot name="secondary-actions"></slot>
          </div>`
        : nothing;

const footerTemplate = (has: boolean) => (has ? html`<div part="footer"><slot name="footer"></slot></div>` : nothing);

interface EmptyStateTemplateProps {
    hasTitle: boolean;
    hasBody: boolean;
    hasFooter: boolean;
    hasActions: boolean;
    hasSecondaryActions: boolean;
    hasFooterContent: boolean;
    useIconSlot: boolean;
    icon: string | undefined;
    noIcon: boolean;
    size: EmptyStateSize;
    loading: boolean;
    showLoading: boolean;
}

export function template(props: EmptyStateTemplateProps) {
    const {
        hasTitle,
        hasBody,
        hasFooter,
        hasActions,
        hasSecondaryActions,
        hasFooterContent,
        useIconSlot,
        icon,
        noIcon,
        size,
        loading,
        showLoading,
    } = props;

    return html`
        <div part="empty-state">
            <div part="content">
                ${iconTemplate(useIconSlot, icon, noIcon, loading, size)}
                ${hasTitle
                    ? html`<div part="title">
                          <slot name="title"></slot>
                      </div>`
                    : nothing}
                ${bodyTemplate(hasBody, showLoading)}
                ${hasFooter
                    ? html` <div part="footer">
                          ${actionsTemplate(hasActions)} ${secondaryActionsTemplate(hasSecondaryActions)}
                          ${footerTemplate(hasFooterContent)}
                      </div>`
                    : nothing}
            </div>
        </div>
    `;
}
