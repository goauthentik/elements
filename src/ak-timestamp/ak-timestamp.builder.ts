import type { ElementRest } from "../types.js";
import { Timestamp } from "./ak-timestamp.component.js";

import { spread } from "@open-wc/lit-helpers";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type TimestampProps = ElementRest & Partial<Timestamp>;

/**
 * @summary Helper function to create a Timestamp component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-timestamp element
 *
 * @see {@link Timestamp} - The underlying web component
 */
export function akTimestamp(options: TimestampProps = {}) {
    const {
        date,
        dateFormat,
        displaySuffix,
        is12Hour,
        locale,
        raw,
        displayUTC,
        timeFormat,
        showElapsed,
        ...rest
    } = options;

    return html`
        <ak-timestamp
            ${spread(rest)}
            date=${ifDefined(date)}
            date-format=${ifDefined(dateFormat)}
            display-suffix=${ifDefined(displaySuffix)}
            ?is-12-hour=${!!is12Hour}
            locale=${ifDefined(locale)}
            .raw=${ifDefined(raw)}
            ?display-utc=${!!displayUTC}
            ?show-elapsed=${!!showElapsed}
            time-format=${ifDefined(timeFormat)}
        ></ak-timestamp>
    `;
}
