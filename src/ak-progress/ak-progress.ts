import { customElement } from "../utils/customElement.js";
import { akProgress, type ProgressProps } from "./ak-progress.builder.js";
import {
    Progress,
    type IProgress,
    type ProgressBarVariant,
    type ProgressBarSeverity,
    type ProgressBarSize,
} from "./ak-progress.component.js";

export {
    akProgress,
    Progress,
    type IProgress,
    type ProgressProps,
    type ProgressBarVariant,
    type ProgressBarSeverity,
    type ProgressBarSize,
};

customElement("ak-progress", Progress);

declare global {
    interface HTMLElementTagNameMap {
        "ak-progress": Progress;
    }
}
