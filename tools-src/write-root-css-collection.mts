import path from "node:path";

import { checkIsInPackageRoot, globSrc, SOURCE_DIR, writeFile } from "./lib/utilities.mjs";

// @ts-expect-error no types provided
import authentikPrettierConfig from "@goauthentik/prettier-config";

import * as prettier from "prettier";

// This script, which must be run from the project root folder, hunts down files of the format
// `<component>.root.scss` and `<component>.root.css` in the source folder and writes their
// filenames to the path `./src/css/components/all-components.scss`. This keeps the list of
// components in sync with the current development tree and provides the Sass compiler with
// the information needed to properly compile the global CSS file.

checkIsInPackageRoot();

const srcPath = path.resolve(process.cwd(), SOURCE_DIR);
const prettierConfig = { ...authentikPrettierConfig, parser: "css" };

function outputTemplate(componentFilenames: string[]) {
    return `/* This is a generated file. Do not edit directly. */

${componentFilenames.map((component: string) => `@import "../../${component.replace(/\.(css|scss)$/, "")}";\n\n`).join("")}

`;
}

const sources = globSrc("**/*.root.{css,scss}");
const output = await prettier.format(outputTemplate(sources), prettierConfig);

writeFile(path.join(SOURCE_DIR, "css/components", "all-components.scss"), output);
