import { Flex } from "../ak-split/ak-flex.component.js";
import styles from "./ak-stack.css";

/**
 * @summary A **stack** is a vertical flex layout component;
 */
export class Stack extends Flex {
    static override readonly styles = [styles];
    flexPrefix = "stack";
}
