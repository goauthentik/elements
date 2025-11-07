import fs from "node:fs";
import path from "node:path";

import {
    BUILD_DIR,
    checkIsInPackageRoot,
    isProduction,
    SASS_OPTS,
    SOURCE_DIR,
    writeFile,
} from "./lib/utilities.mjs";

// @ts-expect-error no types provided
import prettierConfig from "@goauthentik/prettier-config";

import * as prettier from "prettier";
import * as sass from "sass";
import type { RawSourceMap } from "source-map";

// This script, which must be run from the project root folder, copies or processes the files that shoud be
// left *as CSS* in the target folder.

checkIsInPackageRoot();

const SOURCE_FILES = ["./css/authentik.scss", "./css/theme-dark.scss", "./css/patternfly.css"];

const hostEitherRe = /\.s?css$/;

// ../../src/css/authentik.scss

function writeSourceMap(destMapPath: string, sourceMap: RawSourceMap | undefined) {
    if (isProduction || !sourceMap) {
        return;
    }

    const cwd = process.cwd();
    const sources = sourceMap.sources
        .map((s) => s.replace("file://", ""))
        .map((s) => s.replace(cwd, "../.."));

    writeFile(
        destMapPath,
        JSON.stringify({
            ...sourceMap,
            sources,
        }),
    );
}

async function transformSrc(source: string) {
    const sourcePath = path.join(SOURCE_DIR, source);
    const compiled = sass.compile(sourcePath, SASS_OPTS);
    const destPath = path.join(BUILD_DIR, source.replace(hostEitherRe, ".css"));
    const destMapPath = path.join(BUILD_DIR, source.replace(hostEitherRe, ".css.map"));
    const { css, sourceMap } = compiled;

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    writeFile(
        destPath,
        isProduction ? css : await prettier.format(css, { ...prettierConfig, parser: "css" }),
    );
    writeSourceMap(destMapPath, sourceMap);
}

for (const source of SOURCE_FILES) {
    await transformSrc(source);
}

// mkdir -p ./dist/css && sass --pkg-importer=node --quiet src/css/authentik.scss:dist/css/authentik.css src/css/theme-dark.scss:dist/css/theme-dark.css",
