import { mkdir, readFile as fsReadFile, writeFile as fsWriteFile } from "node:fs/promises";
import path from "node:path";

function litTemplate(content) {
    return `import { css } from "lit";

/* This is a generated file. Do not edit directly. */

export const styles = css\`
${content.replace(/\\/g, "\\\\")}
\`;

export default styles;
`;
}

function dtsTemplate() {
    return `export declare const styles: import("lit").CSSResult;
`;
}

// Everything will be utf-8, but JS expects byte buffers first,
// so these help avoid forgetting the conversions.

export async function writeFile(path, content) {
    return await fsWriteFile(path, content, { encoding: "utf8" });
}

export async function readFile(path) {
    return await fsReadFile(path, { encoding: "utf8" });
}

export const transformCssSourceToLitJs = (cssSource) => ({
    css: litTemplate(cssSource),
    dts: dtsTemplate(),
});

// The convention is that the file gets to keep its "css" suffix.
export async function writeCssToDest(cssSource, cssFilenameRoot, destDir) {
    const { css, dts } = transformCssSourceToLitJs(cssSource);
    const outputFile = path.join(destDir, `${cssFilenameRoot}.js`);
    const outputTypeFile = path.join(destDir, `${cssFilenameRoot}.d.ts`);
    const outputDir = path.dirname(outputFile);
    await mkdir(outputDir, { recursive: true });
    await writeFile(outputFile, css);
    await writeFile(outputTypeFile, dts);
}

// await readFile(sourcePath, { encoding: "utf8" })

const buildTransformer = (sourceDir, destDir) =>
    async function (sourceFilename) {
        const sourcePath = path.join(sourceDir, sourceFilename);
        await writeCssToDest(await readFile(sourcePath), sourceFilename, destDir);
        return `${sourceFilename}`;
    };

export async function transformLitCss(componentCSSFiles, sourceDir, destDir) {
    const transformer = buildTransformer(sourceDir, destDir);
    const componentsComplete = await Promise.allSettled(
        componentCSSFiles.map((p) => transformer(p)),
    );
    return {
        successes: componentsComplete.filter((r) => r.status === "fulfilled").map((r) => r.value),
        failures: componentsComplete.filter((r) => r.status === "rejected").map((r) => r.reason),
    };
}
