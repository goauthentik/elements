import { ITimestamp, Timestamp } from "./ak-timestamp.component.js";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type TimestampProps = Partial<ITimestamp>;

/**
 * @summary Helper function to create a Timestamp component programmatically
 *
 * @returns {TemplateResult} A Lit template result containing the configured ak-timestamp element
 *
 * @see {@link Timestamp} - The underlying web component
 */
export function akTimestamp(options: TimestampProps = {}) {
    const {
        customFormat,
        date,
        dateFormat,
        displaySuffix,
        is12Hour,
        locale,
        raw,
        shouldDisplayUTC,
        timeFormat,
    } = options;

    return html`
        <ak-timestamp
            date=${ifDefined(date)}
            .customFormat=${ifDefined(customFormat)}
            date-format=${ifDefined(dateFormat)}
            display-suffix=${ifDefined(displaySuffix)}
            ?is-12-hour=${is12Hour}
            locale=${ifDefined(locale)}
            .raw=${ifDefined(raw)}
            ?display-utc=${shouldDisplayUTC}
            time-format=${ifDefined(timeFormat)}
        ></ak-timestamp>
    `;
}
