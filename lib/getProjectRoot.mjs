import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

export function getProjectRoot() {
    if ("npm_config_local_prefix" in process.env) {
        return process.env.npm_config_local_prefix;
    }

    try {
        // Use the package.json file in the root folder, as it has the current version information.
        return path.resolve(
            // eslint-disable-next-line sonarjs/no-os-command-from-path
            execFileSync("git", ["rev-parse", "--show-toplevel"], {
                encoding: "utf8",
            }).replace("\n", ""),
        );
        // eslint-disable-next-line sonarjs/no-ignored-exceptions
    } catch (_error) {
        // We probably don't have a .git folder, which could happen in container builds.
    }

    // Artificial determination: we're in 'lib', so we assume that the project root is one below us:

    return path.resolve(path.join(fileURLToPath(new URL(".", import.meta.url)), ".."));
}
