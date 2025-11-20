import { customElement } from "../utils/customElement.js";
import { akProgress, type ProgressProps } from "./ak-progress.builder.js";
import {
    type IProgress,
    Progress,
    type ProgressBarSeverity,
    type ProgressBarSize,
    type ProgressBarVariant,
} from "./ak-progress.component.js";

export {
    akProgress,
    type IProgress,
    Progress,
    type ProgressBarSeverity,
    type ProgressBarSize,
    type ProgressBarVariant,
    type ProgressProps,
};

customElement("ak-progress", Progress);

declare global {
    interface HTMLElementTagNameMap {
        "ak-progress": Progress;
    }
}
