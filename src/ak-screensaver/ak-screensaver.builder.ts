import "./ak-screensaver.component.js";

import { Screensaver } from "./ak-screensaver.component.js";

import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export type AkScreensaverProps = Partial<
    Pick<Screensaver, "speed" | "paused" | "forceReducedMotion" | "reducedMotionInterval">
>;

/**
 * @summary Creates an ak-screensaver component programmatically
 *
 * @description Builder function for creating screensaver components. See the Screensaver
 * class for full documentation of properties and slots.
 *
 * @param content - Content to be animated within the screensaver
 * @param options - Configuration options for the screensaver
 * @returns TemplateResult for the ak-screensaver component
 */
export function akScreensaver(
    content: string | TemplateResult = "",
    options: AkScreensaverProps = {},
) {
    const { speed, paused, forceReducedMotion, reducedMotionInterval } = options;

    return html`
        <ak-screensaver
            speed=${ifDefined(speed)}
            ?paused=${!!paused}
            ?force-reduced-motion=${!!forceReducedMotion}
            reduced-motion-interval=${ifDefined(reducedMotionInterval)}
        >
            ${content}
        </ak-screensaver>
    `;
}
