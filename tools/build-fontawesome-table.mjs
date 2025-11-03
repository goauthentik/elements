import fs from "node:fs";
import path from "node:path";

import { getProjectRoot } from "./getProjectRoot.mjs";

import yaml from "yaml";

const metadata = yaml.parse(
    fs.readFileSync(
        path.join(
            getProjectRoot(),
            "node_modules/@fortawesome/fontawesome-free/metadata/icons.yml",
        ),
        {
            encoding: "utf8",
        },
    ),
);

function convertIconMetadata(metadata) {
    const icons = Object.entries(metadata).map(([name, { unicode }]) => [name, unicode]);
    return `/* This is a generated file.  Do not edit.  See 'build-font*-table.mjs'. */

export const icons = new Map([
${icons.map(([name, unicode]) => `    ["${name}", "\\u{${unicode}}"],`).join("\n")}
]);

export default icons;
`;
}

fs.writeFileSync("./src/ak-icon/ak-icons-fontawesome.ts", convertIconMetadata(metadata), {
    encoding: "utf8",
});
