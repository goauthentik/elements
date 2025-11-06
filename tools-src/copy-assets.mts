import { BUILD_DIR, checkIsInPackageRoot, globSrc, SOURCE_DIR } from "./lib/utilities.mjs";

checkIsInPackageRoot();

const assetSources = [...globSrc("**/*.{png,jpeg,jpg,woff,ttf,woff2}"), ...globSrc("./css/*.css")];

import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

// copyFiles
//
// This function will `cwd` into the sourceFolder before running the `glob` function, in order to
// get the hierarchy of files in the source tree without having to worry about cleaning out the
// prefix itself.
//

export async function copyFiles(sourceFiles: string[], targetFolder: string, cwd = ".") {
    const results = await Promise.allSettled(
        sourceFiles.map(async (sourceFile) => {
            const sourcePath = path.join(cwd, sourceFile);
            const targetPath = path.join(targetFolder, sourceFile);
            await mkdir(path.dirname(targetPath), { recursive: true });
            await copyFile(sourcePath, targetPath);
            return sourceFile;
        })
    );

    return {
        successes: results.filter((r) => r.status === "fulfilled").map((r) => r.value),
        failures: results.filter((r) => r.status === "rejected").map((r) => r.reason),
    };
}

await copyFiles(assetSources, BUILD_DIR, SOURCE_DIR);
