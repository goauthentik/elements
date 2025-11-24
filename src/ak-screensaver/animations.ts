import type { DirectionVector, IScreensaver, Position } from "./types.js";

export abstract class ScreensaverAnimation {
    protected host: IScreensaver;

    protected position: Position = { x: 0, y: 0 };

    protected running = false;

    constructor(host: IScreensaver) {
        this.host = host;
    }

    public start() {
        this.running = true;
        this.move();
        return this;
    }

    abstract stop(): typeof this;
    abstract move(): void;

    protected get screensaver() {
        return this.host.screensaver.value!;
    }

    protected get paused() {
        return this.host.paused;
    }

    public resize() {
        const container = this.host.getBoundingClientRect();
        const screensaver = this.screensaver.getBoundingClientRect();

        // Keep the screensaver within bounds when container is resized
        if (this.position.x + screensaver.width > container.width) {
            this.position.x = container.width - screensaver.width;
        }

        if (this.position.y + screensaver.height > container.height) {
            this.position.y = container.height - screensaver.height;
        }

        this.screensaver.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
        return this;
    }
}

export class AnimationReducedMotion extends ScreensaverAnimation {
    #moveIntervalId: ReturnType<typeof setTimeout> | null = null;

    get #interval() {
        return (this.host.reducedMotionInterval ?? 1) * 1000;
    }

    public stop() {
        this.running = false;
        if (this.#moveIntervalId !== null) {
            clearInterval(this.#moveIntervalId);
            this.#moveIntervalId = null;
        }
        return this;
    }

    public move() {
        if (this.paused || !this.running) {
            return;
        }

        const container = this.host.getBoundingClientRect();
        const screensaver = this.screensaver.getBoundingClientRect();

        const maxX = container.width - screensaver.width;
        const maxY = container.height - screensaver.height;

        // eslint-disable-next-line sonarjs/pseudo-random
        const newX = Math.max(0, Math.min(maxX, Math.random() * maxX));
        // eslint-disable-next-line sonarjs/pseudo-random
        const newY = Math.max(0, Math.min(maxY, Math.random() * maxY));

        this.position = { x: newX, y: newY };

        const onTransitionEnd = () => {
            this.screensaver.classList.remove("repositioning");
            this.screensaver.removeEventListener("transitionend", onTransitionEnd);
        };

        this.screensaver.addEventListener("transitionend", onTransitionEnd);
        this.screensaver.classList.add("repositioning");
        this.screensaver.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;

        if (this.#moveIntervalId !== null) {
            clearTimeout(this.#moveIntervalId);
        }

        this.#moveIntervalId = setTimeout(() => {
            this.move();
        }, this.#interval);

        // Remove the transition class after animation completes if the event handler failed, which
        // can happen. See:
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event

        setTimeout(() => {
            // This can run after the component is destroyed. Testing for 'this.screensaver' to make
            // sure it doesn't break.
            if (this.screensaver && this.screensaver.classList.contains("repositioning")) {
                onTransitionEnd();
            }
        }, 1000); // Match this with the CSS transition duration
    }
}

export class AnimationContinuousMotion extends ScreensaverAnimation {
    private animationFrameId: number | null = null;

    private direction: DirectionVector = { x: 1, y: 1 };

    public stop() {
        this.running = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        return this;
    }

    get #speed() {
        return this.host.speed ?? 1.0;
    }

    public move() {
        if (this.paused || !this.running) {
            return;
        }

        const container = this.host.getBoundingClientRect();
        const screensaver = this.screensaver.getBoundingClientRect();

        const newX = this.position.x + this.direction.x * this.#speed;
        const newY = this.position.y + this.direction.y * this.#speed;

        if (newX + screensaver.width >= container.width || newX <= 0) {
            this.direction.x = -1 * this.direction.x;
        }

        if (newY + screensaver.height >= container.height || newY <= 0) {
            this.direction.y = -1 * this.direction.y;
        }

        this.position = { x: newX, y: newY };
        this.screensaver.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
        this.animationFrameId = requestAnimationFrame(() => this.move());
    }
}
