import { akTimestamp, type TimestampProps } from "./ak-timestamp.builder.js";
import {
    Timestamp,
    timestampFormats,
    type ITimestamp,
    type TimestampFormat,
} from "./ak-timestamp.component.js";

export {
    akTimestamp,
    Timestamp,
    timestampFormats,
    type TimestampProps,
    type ITimestamp,
    type TimestampFormat,
};

window.customElements.define("ak-timestamp", Timestamp);

declare global {
    interface HTMLElementTagNameMap {
        "ak-timestamp": Timestamp;
    }
}
