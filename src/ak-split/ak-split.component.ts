import { Flex } from "./ak-flex.component.js";
import styles from "./ak-split.css";

export class Split extends Flex {
    static override readonly styles = [styles];
    flexPrefix = "split";
}
