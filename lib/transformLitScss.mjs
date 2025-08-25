import path from "node:path";

import { writeCssToDest } from "./transformLitCss.mjs";

import * as sass from "sass";

const buildTransformer = (sourceDir, destDir, sassOptions) =>
    async function (sourceFile) {
        const sourcePath = path.join(sourceDir, sourceFile);
        const cssSourceFilename = sourceFile.replace(/\.scss$/, ".css");
        const { css } = sass.compile(sourcePath, sassOptions);
        writeCssToDest(css, cssSourceFilename, destDir);
        return `${sourceFile}`;
    };

export async function transformLitCss(componentScssFiles, sourceDir, destDir, sassOptions = {}) {
    const transformer = buildTransformer(sourceDir, destDir, sassOptions);
    const componentsComplete = await Promise.allSettled(
        componentScssFiles.map((p) => transformer(p)),
    );
    return {
        successes: componentsComplete.filter((r) => r.status === "fulfilled").map((r) => r.value),
        failures: componentsComplete.filter((r) => r.status === "rejected").map((r) => r.reason),
    };
}

export async function transformLitScss(componentCSSFiles, sourceDir, destDir, sassOptions = {}) {
    const transformer = buildTransformer(sourceDir, destDir, sassOptions);
    const componentsComplete = await Promise.allSettled(
        componentCSSFiles.map((p) => transformer(p)),
    );
    const failures = componentsComplete.filter((r) => r.status === "rejected").map((r) => r.reason);
    const successes = componentsComplete
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

    return { successes, failures };
}
