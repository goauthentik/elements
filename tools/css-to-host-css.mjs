import fs from "node:fs";
import * as sass from "sass";
import * as prettier from "prettier";
import prettierConfig from "@goauthentik/prettier-config";
import path from "node:path";
import {
    checkIsInPackageRoot,
    isProduction,
    globSrc,
    writeFile,
    readFile,
    SOURCE_DIR,
    BUILD_DIR,
    SASS_OPTS,
} from "./utilities.mjs";

// The "gapSymbol" is a convention

const gapSymbol = new RegExp("/\\*\\*/", "g");

// This script, which must be run from the project root folder, hunts down files of the format
// `<component>.host.scss` and `<component>.host.css` in the source folder and, after compling the
// Sass if necessary, converts that raw content into a wrapped CSS-in-Javascript file with Lit's
// `css()` wrapper, exporting the CSSResult as both `style` and the default.

checkIsInPackageRoot();

/* CONVENTION: For the purpose of generating component CSS, any css or scss filename in the source folder
 * (filename, not path) that contains only one period will be converted into LIT format. */

const hostCssRe = /ak-[^.]+.css$/;
const hostEitherRe = /(ak-[^.]+.).(css|scss)$/;

const sassOpts = {
    loadPaths: [path.resolve(process.cwd(), "src")],
};

function litTemplate(content) {
    return `import { css } from "lit";

/* This is a generated file. Do not edit directly. */

export const styles = css\`
${content}
\`;

export default styles;
`;
}

function dtsTemplate() {
    return `/* This is a generated file. Do not edit directly. */

export declare const styles: import("lit").CSSResult;
`;
}

async function transformSrc(source) {
    const sourcePath = path.join(SOURCE_DIR, source);
    const code = readFile(sourcePath);
    const rawCss = hostCssRe.test(source) ? code : sass.compile(sourcePath, SASS_OPTS).css;
    // This came up once or twice in testing, mostly in relation to icons and the `content:` property.
    const litCss = rawCss
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$")
        .replace(gapSymbol, "");
    const destPath = path.join(BUILD_DIR, source.replace(hostEitherRe, "$1.css.js"));
    const destTypeFile = path.join(BUILD_DIR, source.replace(hostEitherRe, "$1.css.d.ts"));
    const output = isProduction
        ? litCss
        : await prettier.format(litCss, { ...prettierConfig, parser: "css" });

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    writeFile(destPath, litTemplate(output));
    writeFile(destTypeFile, dtsTemplate());
}

const sources = globSrc("**/*.{css,scss}").filter((source) => hostEitherRe.test(source));
for (const source of sources) {
    await transformSrc(source);
}
