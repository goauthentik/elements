import { readFileSync } from "node:fs";
import path from "node:path";

import { copyFiles } from "./lib/copyFiles.mjs";
import { getProjectRoot } from "./lib/getProjectRoot.mjs";
import { compileTypescriptFiles } from "./lib/processTypescriptWithSWC.mjs";
import { transformLitCss } from "./lib/transformLitCss.mjs";
import { transformLitScss } from "./lib/transformLitScss.mjs";
import { transformScss } from "./lib/transformScss.mjs";

import * as chokidar from "chokidar";
import { globSync } from "glob";
import * as sass from "sass";

const projectRoot = getProjectRoot();

const TARGETDIR = "./dist";

const configFile = path.join(projectRoot, "swcrc.json");
const swcConfig = JSON.parse(readFileSync(configFile, "utf-8"));
swcConfig.jsc.baseUrl = projectRoot;

const scssOptions = {
    importers: [new sass.NodePackageImporter()],
};

// Don't compile Scss utility import files.
const scssForIncludeOnly = (scssfile) => !/\/_[^/]+\.s?css$/.exec(scssfile);

// All of the import paths are relative to the '/.src' folder
const globSrc = (glob) => globSync(glob, { cwd: "./src" });

async function build() {
    // SCSS Files that will *not* be converted to lit format
    const rootScssSources = ["css/authentik.scss", "css/theme-dark.scss"];
    const rootScssBuilds = await transformScss(rootScssSources, "./src", "./dist", scssOptions);
    const rootScssTransforms = await transformLitScss(
        rootScssSources,
        "./src",
        "./dist",
        scssOptions
    );

    // SCSS Files that will be converted to lit format
    const compScssSources = globSrc("**/ak-*/ak-*.scss").filter(scssForIncludeOnly);
    const compScssBuilds = await transformLitScss(compScssSources, "./src", "./dist", scssOptions);

    // CSS Files that need to be converted to lit format
    const compCssSources = [
        ...globSrc("**/ak-*/ak-*.css").filter(scssForIncludeOnly),
        "./ak-icon/pficons/pficons.css",
        "./ak-icon/fontawesome/fontawesome.css",
        "./css/components/component_reset.css",
    ];

    const compCssBuilds = await transformLitCss(compCssSources, "./src", "./dist", scssOptions);

    // Typescript files that will be transpiled to JavaScript
    const typescriptSources = globSrc("**/*.{ts,js}");
    const typescriptBuilds = await compileTypescriptFiles(
        typescriptSources,
        swcConfig,
        "./src",
        "./dist"
    );

    // CSS, Font files, and other assets that do not require conversion
    const assetSources = [
        ...globSrc("**/*.{png,jpeg,jpg,woff,ttf,woff2}"),
        ...globSrc("./css/*.css"),
    ];

    await copyFiles(assetSources, TARGETDIR, "./src");

    for (const [build, name] of [
        [rootScssBuilds, "Sass to CSS"],
        [rootScssTransforms, "Root Sass to LitCSS"],
        [compScssBuilds, "Component Sass to LitCSS"],
        [compCssBuilds, "CSS to LitCSS"],
        [typescriptBuilds, "TSC Builds"],
    ]) {
        // eslint-disable-next-line no-console
        console.log(name);
        const successMessages = build.successes.map((s) => `    ${s}`).join("\n");
        // eslint-disable-next-line no-console
        console.log(`Passed:\n\n${successMessages}`);

        if (build.failures.length > 0) {
            // eslint-disable-next-line no-console
            console.log("\nFailures:");
            // eslint-disable-next-line no-console
            console.log(build.failures.join("\n\n"));
        }
    }
}

let timeoutId = null;
function debouncedBuild() {
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        // eslint-disable-next-line no-console
        console.clear();
        build();
    }, 250);
}

if (process.argv.length > 2 && (process.argv[2] === "-w" || process.argv[2] === "--watch")) {
    // eslint-disable-next-line no-console
    console.log("Watching ./src for changes");
    chokidar.watch("./src").on("all", (event, path) => {
        if (!["add", "change", "unlink"].includes(event)) {
            return;
        }
        if (!/(\.css|\.ts|\.js)$/.test(path)) {
            return;
        }
        debouncedBuild();
    });
} else {
    build();
}
