import { akTimestamp, type TimestampProps } from "./ak-timestamp.builder.js";
import {
    type ITimestamp,
    Timestamp,
    type TimestampFormat,
    timestampFormats,
} from "./ak-timestamp.component.js";

export {
    akTimestamp,
    type ITimestamp,
    Timestamp,
    type TimestampFormat,
    timestampFormats,
    type TimestampProps,
};

window.customElements.define("ak-timestamp", Timestamp);

declare global {
    interface HTMLElementTagNameMap {
        "ak-timestamp": Timestamp;
    }
}
