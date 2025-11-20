import type { INotificationCounter } from "./ak-notification-counter.types.js";

import { html, nothing } from "lit";

// The `part="bell"` is used in multiple places because the expectation is that its only use will be
// to control the color of the bell element itself; in a better world, we would be able to limit CSS
// access to only the `fill` and `stroke` qualities.
export const template = ({ count }: INotificationCounter) =>
    html` <div part="notification-counter">
        <svg
            id="Layer_1"
            aria-hidden="true"
            version="1.1"
            viewBox="0 0 512 512"
            xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg"
            part="bell"
        >
            <g>
                <path
                    part="bell"
                    d="M381.7,225.9c0-97.6-52.5-130.8-101.6-138.2c0-0.5,0.1-1,0.1-1.6c0-12.3-10.9-22.1-24.2-22.1c-13.3,0-23.8,9.8-23.8,22.1   c0,0.6,0,1.1,0.1,1.6c-49.2,7.5-102,40.8-102,138.4c0,113.8-28.3,126-66.3,158h384C410.2,352,381.7,339.7,381.7,225.9z"
                />
                <path
                    part="bell"
                    d="M256.2,448c26.8,0,48.8-19.9,51.7-43H204.5C207.3,428.1,229.4,448,256.2,448z"
                />
            </g>
        </svg>
        ${count < 1
            ? nothing
            : html`<div aria-hidden="true" part="counter">
                  <span part="number">${count}</span>
              </div>`}
    </div>`;
