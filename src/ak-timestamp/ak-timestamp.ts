import { akTimestamp, type TimestampProps } from "./ak-timestamp.builder.js";
import { Timestamp, type TimestampFormat, timestampFormats } from "./ak-timestamp.component.js";

export { akTimestamp, Timestamp, type TimestampFormat, timestampFormats, type TimestampProps };

window.customElements.define("ak-timestamp", Timestamp);

declare global {
    interface HTMLElementTagNameMap {
        "ak-timestamp": Timestamp;
    }
}
