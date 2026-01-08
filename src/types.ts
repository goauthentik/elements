import { LitElement } from "lit";

export type DataRecord = {
    [key: `data-${string}`]: string | boolean;
};

export type AriaRecord = {
    [key: `aria-${string}`]: string | boolean;
};

export type ElementRest = Partial<LitElement> & DataRecord & AriaRecord;
