import styles from "./ak-screensaver.css";
import {
    AnimationContinuousMotion,
    AnimationReducedMotion,
    type ScreensaverAnimation,
} from "./animations.js";
import { type IScreensaver } from "./types.js";

import { html, LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators/property.js";
import { state } from "lit/decorators/state.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";

/**
 * @element ak-screensaver
 *
 * @summary A screensaver-style screensaver component that creates bouncing animations
 *
 * @description This is an implementation of the 1990s animation that would bounce the "DVD" logo
 * around the TV screen when there was no disc in a DVD player.  If the user prefers-reduced-motion,
 * it repositions the logo on an interval without animation.
 *
 * @attr {number} speed - Animation speed multiplier for continuous motion (default: 1.0)
 * @attr {boolean} paused - Whether the animation is paused
 * @attr {boolean} force-reduced-motion - Forces reduced motion mode regardless of user preference
 * @attr {number} reduced-motion-interval - Interval in seconds between position changes in reduced motion mode (default: 60)
 *
 * @property {Function} pause - toggle the `paused` state
 *
 * @slot - Content to be animated (text, images, SVGs, etc.)
 *
 * @csspart screensaver - The animated content container
 *
 * @cssprop --pf-v5-c-screensaver--Background - Background color of the screensaver overlay (default: black)
 * @cssprop --pf-v5-c-screensaver--Height - Height of the animated content container (default: 4rem)
 * @cssprop --pf-v5-c-screensaver--Transition - Transition timing for reduced motion repositioning (default: 1s ease-in-out)
 * @cssprop --pf-v5-c-screensaver--Color - Color applied to slotted content (default: primary-color-100)
 *
 * @fires toggle - Dispatched when animation is paused/resumed (if implemented)
 *
 */
export class Screensaver extends LitElement implements IScreensaver {
    static readonly styles = [styles];

    @property({ type: Number, reflect: true })
    public speed = 1.0;

    @property({ type: Boolean, reflect: true })
    public paused = false;

    @property({ type: Boolean, attribute: "force-reduced-motion" })
    public forceReducedMotion = false;

    @property({ type: Number, attribute: "reduced-motion-interval" })
    public reducedMotionInterval = 60;

    @state()
    private prefersReducedMotion = false;

    #reducedMotionQuery: MediaQueryList | null = null;

    #animation: ScreensaverAnimation = new AnimationReducedMotion(this);

    public screensaver: Ref<HTMLDivElement> = createRef();

    public pause() {
        this.paused = !this.paused;
    }

    public override connectedCallback() {
        super.connectedCallback();

        this.#reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        this.prefersReducedMotion = this.#reducedMotionQuery.matches;

        this.#reducedMotionQuery.addEventListener("change", this.onReducedMotionChange);
        window.addEventListener("resize", this.onResize);

        if (!this.prefersReducedMotion && !this.forceReducedMotion) {
            this.#animation = new AnimationContinuousMotion(this);
        }
    }

    public override disconnectedCallback() {
        this.#animation.stop();

        if (this.#reducedMotionQuery) {
            this.#reducedMotionQuery.removeEventListener("change", this.onReducedMotionChange);
        }

        window.removeEventListener("resize", this.onResize);
        super.disconnectedCallback();
    }

    private onReducedMotionChange = (ev: MediaQueryListEvent | MediaQueryList) => {
        this.prefersReducedMotion = ev.matches;
    };

    private onResize = () => {
        this.#animation.stop().resize().start();
    };

    public override updated(changed: PropertyValues<this>) {
        this.#animation.stop();
        if (changed.has("forceReducedMotion")) {
            if (this.#animation instanceof AnimationContinuousMotion && this.forceReducedMotion) {
                this.#animation = new AnimationReducedMotion(this);
            }
            if (
                !this.forceReducedMotion &&
                !this.prefersReducedMotion &&
                this.#animation instanceof AnimationReducedMotion
            ) {
                this.#animation = new AnimationContinuousMotion(this);
            }
        }
        if (changed.has("paused")) {
            this.dispatchEvent(new Event("toggle"));
        }
        if (!this.paused) {
            this.#animation.start();
        }
    }

    public override render() {
        return html`<div part="screen">
            <div ${ref(this.screensaver)} part="screensaver" id="screensaver"><slot></slot></div>
        </div>`;
    }

    public override firstUpdated() {
        if (!this.paused) {
            this.#animation.start();
        }
    }
}
