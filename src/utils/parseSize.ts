import { match, P } from "ts-pattern";

type MaybeStyles = Partial<CSSStyleDeclaration> | null;

const localDimensions = (container: Element, styles?: MaybeStyles, content?: string) => {
    const element = document.createElement("div");
    Object.assign(element.style, {
        ...element.style,
        position: "absolute",
        zIndex: Number.MIN_SAFE_INTEGER,
        left: 0,
        top: 0,
        visibility: "hidden",
        ...(styles ?? {}),
    });

    if (content) {
        element.innerHTML = content;
    }

    container.appendChild(element);
    const dimensions = { width: element.offsetWidth, height: element.offsetHeight };
    container.removeChild(element);
    return dimensions;
};

const localWidth = (container: Element, styles?: MaybeStyles, content?: string) =>
    localDimensions(container, styles, content).width;

const localHeight = (container: Element, styles?: MaybeStyles, content?: string) =>
    localDimensions(container, styles, content).height;

const elementFontSize = (element: Element) => parseFloat(getComputedStyle(element, "").fontSize);

const nonZero = (v: number) => (v === 0 ? 1 : v);

// Returns the values in pixels.

export const convert = {
    fromEm: (v: number, e: Element) => v * elementFontSize(e),
    fromRem: (v: number) => v * elementFontSize(document.documentElement),
    fromCh: (v: number, e: Element) => v / nonZero(localWidth(e, null, "0")),
};

export function parseLength(length: string, element?: Element) {
    const g = /^([.]\d+|\d+[.]?\d*)\s*(rem|em|ch|px)/i.exec(length.trim());
    if (!g) {
        return 0;
    }
    try {
        const value = parseFloat(g[1]);
        return match([g[2], element])
            .with(["em", P.nullish], () => convert.fromRem(value))
            .with(["em", P.nonNullable], ([_, element]) => convert.fromEm(value, element))
            .with(["ch", P.nullish], () => convert.fromCh(value, document.documentElement))
            .with(["ch", P.nonNullable], ([_, element]) => convert.fromCh(value, element))
            .with(["rem", P._], () => convert.fromRem(value))
            .otherwise(() => value);
    } catch (e: unknown) {
        console.log(`Error parsing length value: ${String(e)}`);
        return 0;
    }
}
