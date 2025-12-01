import { intersectionObserver } from "../observers/intersection-observer.js";
import { mediaQuery } from "../observers/mediaquery-observer.js";
import { formatElapsedTime } from "../utils/temporal.js";
import styles from "./ak-timestamp.css";

import { observed } from "@patternfly/pfe-core/decorators/observed.js";
import { parseISO } from "date-fns";
import { match } from "ts-pattern";

import { msg } from "@lit/localize";
import { html, LitElement, nothing, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

/**
 * Enum for timestamp format options
 */

export const timestampFormats = ["full", "long", "medium", "short"] as const;
export type TimestampFormat = (typeof timestampFormats)[number];

export const isValidDate = (date: Date | null): boolean => Boolean(date && !isNaN(date.getTime()));

const convertToUTCString = (date: Date) => date.toUTCString().slice(0, -3);

const checkAndValidate = (d: Date | null) => (isValidDate(d) ? d : null);

// For times less than a minute, check every quarter second, to avoid the "6 seconds"... "8 seconds"
// phenom.  Only update when it *actually* changes.
const SHORT_INTERVAL = 250;

// For times more than a minute, just check every 30 seconds.
const LONG_INTERVAL = 30 * 1000;

const ONE_MINUTE = 60 * 1000;

const mapHas = (
    changed: Map<PropertyKey, unknown>,
    keys: PropertyKey | PropertyKey[],
    ...rest: PropertyKey[]
) => (Array.isArray(keys) ? [...keys, ...rest] : [keys, ...rest]).some((key) => changed.has(key));

/**
 * Interface for TimestampOptions
 */
export interface ITimestamp {
    date?: string;
    raw?: Date;
    dateFormat?: TimestampFormat;
    timeFormat?: TimestampFormat;
    displaySuffix?: string;
    is12Hour?: boolean;
    locale?: string;
    displayUTC?: boolean;
}

/**
 * @element ak-timestamp
 * @class Timestamp
 *
 * A component that displays a formatted date and time with extensive customization options. The
 * timestamp supports various date formats, time formats, localization, and UTC display.
 *
 * If the provided date is invalid or cannot be parsed, the component will display a warning
 * message instead of the timestamp.
 *
 * ## Features
 *
 * - Can show dates using standard locale formats (full, long, medium, short)
 * - Display either local time or UTC time
 * - Support for custom time zone suffixes
 * - 12/24 hour time format options
 * - Localization support via browser or specified locales
 * - Error handling for invalid date inputs
 * - Accessible time display with proper semantic HTML
 *
 * ## CSS Custom Properties
 *
 * @cssprop {font-size} --pf-v5-c-timestamp--FontSize - Font size for timestamp text (default: 0.875rem)
 * @cssprop {color} --pf-v5-c-timestamp--Color - Text color of the timestamp (default: #6a6e73)
 * @cssprop {color} --pf-v5-c-timestamp--Warning--Color - Text color for warning messages (default: #795600)
 * @cssprop {font-weight} --pf-v5-c-timestamp--Warning--FontWeight - Font weight for warning messages (default: 700)
 * @cssprop {length} --pf-v5-c-timestamp--OutlineOffset - Outline offset for focus states (default: 0.1875rem)
 *
 * ## Styling Hooks
 *
 * @csspart time - The time element that displays the formatted date. Use this to customize the appearance of the timestamp.
 *
 */
export class Timestamp extends LitElement implements ITimestamp {
    public static readonly styles = [styles];

    /**
     * The date as a string. May also be a timestamp number from the epoch, in milliseconds.
     *
     * @attr
     */
    @observed
    @property({ type: String })
    public date: string = `${new Date().toISOString()}`;

    /**
     * A raw Date object. Takes precendence over the string variant.
     *
     * @prop
     */
    @observed
    @property({ type: Object })
    public raw!: Date;

    /**
     * The date format, as specified is Intl.DateTimeFormatOptions.
     *
     * @attr
     */
    @property({ type: String, attribute: "date-format" })
    public dateFormat?: TimestampFormat = "long";

    /**
     * The time format, as specified is Intl.DateTimeFormatOptions
     *
     * @attr
     */
    @property({ type: String, attribute: "time-format" })
    public timeFormat?: TimestampFormat = "long";

    /**
     * Mostly to show custom timezone names.
     *
     * @attr
     */
    @property({ type: String, attribute: "display-suffix" })
    public displaySuffix = "";

    /**
     * Force 12-hour display.  Will use the locale format if undefined.
     *
     * @attr
     */
    @property({ type: Boolean, attribute: "is-12-hour" })
    public is12Hour?: boolean;

    /**
     * Defaults to browser's locale if not specified
     *
     * @attr
     */
    @property({ type: String })
    public locale?: string;

    /**
     * @attr
     */
    @property({ type: Boolean, attribute: "display-utc" })
    public displayUTC = false;

    /**
     * @attr
     */
    @property({ type: Boolean, attribute: "show-elapsed" })
    public showElapsed = false;

    @intersectionObserver()
    public visible = false;

    @mediaQuery("(prefers-reduced-motion: reduce)")
    public prefersReducedMotion = false;

    #date: Date | null = null;

    #timeoutID: ReturnType<typeof setTimeout> | null = null;

    #interval = -1;

    protected _rawChanged() {
        const checkedDate = checkAndValidate(this.raw);
        if (checkedDate) {
            this.date = checkedDate.toISOString();
            this._dateChanged();
        }
    }

    protected _dateChanged() {
        this.#date = match(this.date)
            .when(
                (d: string) => /^\d+$/.test(d),
                (d: string) => checkAndValidate(new Date(parseInt(d, 10))),
            )
            .when(
                (d: string) => typeof d === "string",
                (d: string) => checkAndValidate(parseISO(d)),
            )
            .otherwise(() => {
                console.warn(`Unable to validate date ${this.date}`);
                return null;
            });
    }

    public override disconnectedCallback() {
        super.disconnectedCallback();
        this.stopElapsedCounter();
    }

    public get isVisible() {
        return Boolean(this.#date || document.visibilityState === "visible" || this.visible);
    }

    public get runElapsed() {
        return this.#date && this.isVisible && this.showElapsed;
    }

    public stopElapsedCounter = () => {
        if (this.#timeoutID !== null) {
            clearTimeout(this.#timeoutID);
            this.#timeoutID = null;
        }
        this.#interval = -1;
    };

    #tick = () => {
        if (!this.runElapsed) {
            return;
        }
        this.requestUpdate();
        this.startElapsedCounter();
    };

    public startElapsedCounter = () => {
        this.stopElapsedCounter();
        if (!(this.runElapsed && this.#date)) {
            return;
        }

        const timeSince = Date.now() - this.#date.getTime();
        this.#interval =
            timeSince < ONE_MINUTE && !this.prefersReducedMotion ? SHORT_INTERVAL : LONG_INTERVAL;
        this.#timeoutID = setTimeout(this.#tick, this.#interval);
    };

    private get formattingOptions(): Intl.DateTimeFormatOptions {
        const { dateFormat, is12Hour } = this;
        return {
            ...(dateFormat && { dateStyle: dateFormat }),
            ...(is12Hour !== undefined && { hour12: is12Hour }),
        };
    }

    protected localeDate(date: Date) {
        const { locale, formattingOptions, timeFormat, displaySuffix } = this;
        const dateAsString = date.toLocaleString(locale, {
            ...formattingOptions,
            ...(timeFormat && { timeStyle: this.timeFormat }),
        });
        return `${dateAsString}${displaySuffix ? " " + displaySuffix : ""}`;
    }

    protected utcDate(date: Date) {
        const { formattingOptions, timeFormat, displaySuffix, locale } = this;
        const utcTimeFormat = this.timeFormat !== "short" ? "medium" : "short";
        const dateAsString = new Date(convertToUTCString(date)).toLocaleString(locale, {
            ...formattingOptions,
            ...(timeFormat && { timeStyle: utcTimeFormat }),
        });
        const defaultUTCSuffix = timeFormat === "full" ? msg("Coordinated Universal Time") : "UTC";
        return `${dateAsString} ${displaySuffix ? displaySuffix : defaultUTCSuffix}`;
    }

    private formattedDate(date: Date) {
        return this.displayUTC ? this.utcDate(date) : this.localeDate(date);
    }

    public updated(changed: PropertyValues<this>): void {
        super.updated(changed);
        if (mapHas(changed, "date", "raw", "visible", "showElapsed")) {
            this.startElapsedCounter();
        }
    }

    renderElapsedTime(date: Date) {
        if (!this.showElapsed) {
            return nothing;
        }
        const elapsed = formatElapsedTime(date);
        return html`<span part="elapsed">(${elapsed})</span>`;
    }

    renderDate(date: Date) {
        return html` <time part="timestamp" datetime="${date.toISOString()}"
            >${this.formattedDate(date)}${this.renderElapsedTime(date)}</time
        >`;
    }

    render() {
        return this.#date !== null
            ? this.renderDate(this.#date)
            : html`<span part="warning">${msg("Failed to parse time")}</span>`;
    }
}
