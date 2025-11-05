import * as sass from "sass";
export declare const SOURCE_DIR = "./src";
export declare const BUILD_DIR = "./dist";
export declare const globSrc: (glob: any) => string[];
export declare const writeFile: (path: any, content: any) => void;
export declare const readFile: (path: any) => string;
export declare function checkIsInPackageRoot(): void;
export declare const NODE_ENV: string;
export declare const isProduction: boolean;
export declare const SASS_OPTS: {
    loadPaths: string[];
    importers: sass.NodePackageImporter[];
    style: string;
    sourceMap: boolean;
    silenceDeprecations: string[];
};
//# sourceMappingURL=utilities.d.mts.map