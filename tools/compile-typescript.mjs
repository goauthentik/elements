import fsp from "fs/promises";
import path from "path";
import { BUILD_DIR, checkIsInPackageRoot, globSrc, readFile, SOURCE_DIR, } from "./lib/utilities.mjs";
import swc from "@swc/core";
checkIsInPackageRoot();
const configFile = path.join("./swcrc.json");
const swcConfig = JSON.parse(readFile(configFile));
swcConfig.jsc.baseUrl = process.cwd();
// When compiling a file to JavaScript, if we find an import statement that pulls in
// css or sass as a default, modify the import statement so that it refers to the
// CSSResult-wrapped version created by the compiler, which is a JavaScript file and
// ends in ".js".
const importStatement = /^import\s+(\w+)\s+from\s+(["'])([^"']+)\.(css|scss)(["']);/;
// eslint-disable-next-line max-params
const fixedImport = (_match, importName, delim1, filename, _suffix, delim2) => `import ${importName} from ${delim1}${filename}.css.js${delim2};`;
async function compileOneSource(sourceFile) {
    const sourcePath = path.join(SOURCE_DIR, sourceFile);
    const sourceCode = await fsp.readFile(sourcePath, "utf-8");
    // Compute output path, maintaining directory structure
    const outputPath = path.join(BUILD_DIR, sourceFile.replace(/\.ts$/, ".js"));
    // Ensure the output directory exists
    const outputDir = path.dirname(outputPath);
    await fsp.mkdir(outputDir, { recursive: true });
    const { code, map } = await swc.transform(sourceCode, {
        ...swcConfig,
        filename: sourcePath,
    });
    const updatedCode = code
        .split("\n")
        .map((s) => s.replace(importStatement, fixedImport))
        .join("\n");
    // Write the output
    await fsp.writeFile(outputPath, updatedCode);
    // Write source map if enabled
    if (map && swcConfig.sourceMaps) {
        await fsp.writeFile(`${outputPath}.map`, map);
    }
    return sourceFile;
}
const typescriptSources = globSrc("**/*.{ts,js}");
const results = await Promise.allSettled(typescriptSources.map(compileOneSource));
const successes = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
const failures = results.filter((r) => r.status === "rejected").map((r) => r.reason);
const successMessages = successes.map((s) => `    ${s}`).join("\n");
// eslint-disable-next-line no-console
console.log(`Passed:\n\n${successMessages}`);
if (failures.length > 0) {
    // eslint-disable-next-line no-console
    console.log("\nFailures:");
    // eslint-disable-next-line no-console
    console.log(failures.join("\n\n"));
}
