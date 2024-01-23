import { PlatformAccessory, Logger, API } from "homebridge";
import { TidbytHomebridgePlatform } from "./platform";
export declare class TidbytTVAccessory {
    private readonly api;
    private readonly platform;
    private readonly accessory;
    private readonly log;
    private readonly pixletUrl;
    private service;
    private state;
    private options;
    constructor(api: API, platform: TidbytHomebridgePlatform, accessory: PlatformAccessory, log: Logger, pixletUrl: string);
    register(): Promise<void>;
    setState(state: string): Promise<void>;
    getOptions(): Promise<string[]>;
}
//# sourceMappingURL=tidbytTv.d.ts.map