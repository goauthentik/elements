import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import swc from "@swc/core";

// When compiling a file to JavaScript, if we find an import statement that pulls in
// css or sass as a default, modify the import statement so that it refers to the
// CSSResult-wrapped version created by the compiler, which is a JavaScript file and
// ends in ".js".

const importStatement = /^import\s+(\w+)\s+from\s+(["'])([^"']+)\.(css|scss)(["']);/;

// eslint-disable-next-line max-params
const fixedImport = (match, importName, delim1, filename, _suffix, delim2) =>
    `import ${importName} from ${delim1}${filename}.css.js${delim2};`;

export const buildCompiler = (config, sourceDir, destDir) =>
    async function (sourceFile) {
        const sourcePath = path.join(sourceDir, sourceFile);
        const sourceCode = await readFile(sourcePath, "utf-8");

        // Compute output path, maintaining directory structure
        const outputPath = path.join(destDir, sourceFile.replace(/\.ts$/, ".js"));

        // Ensure the output directory exists
        const outputDir = path.dirname(outputPath);
        await mkdir(outputDir, { recursive: true });

        const { code, map } = await swc.transform(sourceCode, {
            ...config,
            filename: sourcePath,
        });

        const updatedCode = code
            .split("\n")
            .map((s) => s.replace(importStatement, fixedImport))
            .join("\n");
        // Write the output
        await writeFile(outputPath, updatedCode);

        // Write source map if enabled
        if (map && config.sourceMaps) {
            await writeFile(`${outputPath}.map`, map);
        }

        return sourceFile;
    };

export async function compileTypescriptFiles(sourceFiles, config, sourceDir, destDir) {
    const transformer = buildCompiler(config, sourceDir, destDir);
    const results = await Promise.allSettled(sourceFiles.map((s) => transformer(s)));

    return {
        successes: results.filter((r) => r.status === "fulfilled").map((r) => r.value),
        failures: results.filter((r) => r.status === "rejected").map((r) => r.reason),
    };
}
