export declare const config: {
    runner: string;
    specs: string[];
    exclude: never[];
    maxInstances: number;
    capabilities: {
        "maxInstances": number;
        "browserName": string;
        "goog:chromeOptions": {
            args: string[];
        };
    }[];
    logLevel: string;
    deprecationWarnings: boolean;
    bail: number;
    waitforTimeout: number;
    connectionRetryTimeout: number;
    connectionRetryCount: number;
    framework: string;
    reporters: string[];
    mochaOpts: {
        ui: string;
        timeout: number;
    };
};
