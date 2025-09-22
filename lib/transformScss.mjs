import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import * as sass from "sass";

const buildTransformer = (sourceDir, destDir, sassOptions) =>
    async function (sourceFile) {
        const sourcePath = path.join(sourceDir, sourceFile);
        const outputFilename = sourceFile.replace(/\.scss$/, ".css");
        const outputPath = path.join(destDir, outputFilename);
        const { css } = sass.compile(sourcePath, sassOptions);
        const outputDir = path.dirname(outputPath);
        await mkdir(outputDir, { recursive: true });
        await writeFile(outputPath, css, { encoding: "utf8" });
        return `${sourceFile}`;
    };

export async function transformScss(scssFiles, sourceDir, destDir, sassOptions = {}) {
    const transformer = buildTransformer(sourceDir, destDir, sassOptions);
    const componentsComplete = await Promise.allSettled(scssFiles.map((p) => transformer(p)));
    const failures = componentsComplete.filter((r) => r.status === "rejected").map((r) => r.reason);
    const successes = componentsComplete
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
    return { successes, failures };
}
