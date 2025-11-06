import path from "node:path";
import { checkIsInPackageRoot, globSrc, SOURCE_DIR, writeFile } from "./lib/utilities.mjs";
// This script, which must be run from the project root folder, hunts down files of the format
// `<component>.root.scss` and `<component>.root.css` in the source folder and writes their
// filenames to the path `./src/css/components/all-components.scss`. This keeps the list of
// components in sync with the current development tree and provides the Sass compiler with
// the information needed to properly compile the global CSS file.
checkIsInPackageRoot();
const srcPath = path.resolve(process.cwd(), SOURCE_DIR);
function outputTemplate(componentFilenames) {
    return `/* This is a generated file. Do not edit directly. */

${componentFilenames.map((component) => `@import "../../${component.replace(/\.(css|scss)$/, "")}";\n\n`).join("")}

`;
}
const sources = globSrc("**/*.root.{css,scss}");
const output = outputTemplate(sources);
writeFile(path.join(SOURCE_DIR, "css/components", "all-components.scss"), output);
