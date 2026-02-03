import { akProgress, type ProgressProps } from "./ak-progress.builder.js";
import {
    Progress,
    type ProgressBarSeverity,
    type ProgressBarSize,
    type ProgressBarVariant,
} from "./ak-progress.component.js";

export {
    akProgress,
    Progress,
    type ProgressBarSeverity,
    type ProgressBarSize,
    type ProgressBarVariant,
    type ProgressProps,
};

window.customElements.define("ak-progress", Progress);

declare global {
    interface HTMLElementTagNameMap {
        "ak-progress": Progress;
    }
}
