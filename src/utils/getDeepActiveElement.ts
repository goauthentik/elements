/**
 * `document.activeElement` returns only the top-level shadowHost that contains the current
 * active element. This function traverses shadowRoots until it finds the actual active element.
 */

export function getDeepActiveElement(root: Document | ShadowRoot = document) {
    let active = root.activeElement;
    while (active && active.shadowRoot && active.shadowRoot.activeElement) {
        active = active.shadowRoot.activeElement;
    }
    return active instanceof HTMLElement ? active : null;
}
