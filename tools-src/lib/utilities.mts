import fs from "node:fs";
import path from "node:path";

import { globSync } from "glob";
import * as sass from "sass";

// Since all of these build tools are supposed to be run from the project root,
export const SOURCE_DIR = "./src";
export const BUILD_DIR = "./dist";

export const globSrc = (glob: string) => globSync(glob, { cwd: SOURCE_DIR });
export const writeFile = (path: string, content: string) =>
    fs.writeFileSync(path, content, { encoding: "utf8" });
export const readFile = (path: string) => fs.readFileSync(path, { encoding: "utf8" });

export function checkIsInPackageRoot() {
    if (!fs.existsSync("./package.json")) {
        // eslint-disable-next-line no-console
        console.log("This script must be run from the package root.");
        process.exit();
    }
}

export const NODE_ENV = process.env.NODE_ENV || "development";

export const isProduction = NODE_ENV === "production";

const style = (isProduction ? "compressed" : "expanded") as sass.OutputStyle;
export const SASS_OPTS = {
    loadPaths: [path.resolve(process.cwd(), SOURCE_DIR)],
    importers: [new sass.NodePackageImporter()],
    style,
    sourceMap: !isProduction,
    silenceDeprecations: ["import"] as sass.DeprecationOrId[],
};
