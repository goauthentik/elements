import { type Ref } from "lit/directives/ref.js";

export interface DirectionVector {
    x: number;
    y: number;
}

export interface Position {
    x: number;
    y: number;
}

export interface IScreensaver extends HTMLElement {
    speed?: number;
    paused?: boolean;
    forceReducedMotion?: boolean;
    reducedMotionInterval?: number;
    screensaver: Ref<HTMLDivElement>;
}
