import { LitElement } from "lit";

export class AkLitElement extends LitElement {
    protected hasSlotted(name: string | null) {
        const isNotNestedSlot = (start: Element) => {
            let node = start.parentNode;
            while (node && node !== this) {
                if (node instanceof Element && node.hasAttribute("slot")) {
                    return false;
                }
                node = node.parentNode;
            }
            return true;
        };

        // All child slots accessible from the component's LightDOM that match the request
        const allChildSlotRequests =
            typeof name === "string"
                ? [...this.querySelectorAll(`[slot="${name}"]`)]
                : [...this.children].filter((child) => {
                      const slotAttr = child.getAttribute("slot");
                      return !slotAttr || slotAttr === "";
                  });

        // All child slots accessible from the LightDom that match the request *and* are not nested
        // within another slotted element.
        return allChildSlotRequests.filter((node) => isNotNestedSlot(node)).length > 0;
    }
}
