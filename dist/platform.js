"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TidbytHomebridgePlatform = void 0;
const settings_1 = require("./settings");
const platformAccessory_1 = require("./platformAccessory");
const tidbytTv_1 = require("./tidbytTv");
// three devices
// 1. tidbyt (TV) (can switch between clock, morning, and yulelog
// read file names those will be the options
// 2. tidbyt clock (multicolor lamp)
/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
class TidbytHomebridgePlatform {
    log;
    config;
    api;
    Service = this.api.hap.Service;
    Characteristic = this.api.hap.Characteristic;
    // this is used to track restored cached accessories
    accessories = [];
    tidbytTVUUID = this.api.hap.uuid.generate("tidbyt-tv");
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.log.debug("Finished initializing platform:", this.config.name);
        // When this event is fired it means Homebridge has restored all cached accessories from disk.
        // Dynamic Platform plugins should only register new accessories after this event was fired,
        // in order to ensure they weren't added to homebridge already. This event can also be used
        // to start discovery of new accessories.
        this.api.on("didFinishLaunching", () => {
            log.debug("Executed didFinishLaunching callback");
            // run the method to discover / register your devices as accessories
            this.discoverDevices();
        });
    }
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory) {
        this.log.info("Loading accessory from cache:", accessory.displayName);
        // add the restored accessory to the accessories cache so we can track if it has already been registered
        this.accessories.push(accessory);
    }
    /**
     * This is an example method showing how to register discovered accessories.
     * Accessories must only be registered once, previously created accessories
     * must not be registered again to prevent "duplicate UUID" errors.
     */
    discoverDevices() {
        // try to get the tidbyt tv
        const existingTV = this.accessories.find((accessory) => accessory.UUID === this.tidbytTVUUID);
        if (existingTV) {
            const pixletURL = existingTV.context.pixletUrl;
            new tidbytTv_1.TidbytTVAccessory(this.api, this, existingTV, this.log, pixletURL);
        }
        else {
            const accessory = new this.api.platformAccessory("Tidbyt TV", this.tidbytTVUUID);
            accessory.context.pixletUrl = this.config.pixletURL;
            this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [
                accessory,
            ]);
        }
        // EXAMPLE ONLY
        // A real plugin you would discover accessories from the local network, cloud services
        // or a user-defined array in the platform config.
        const exampleDevices = [
        // {
        //   exampleUniqueId: 'EFGH',
        //   exampleDisplayName: 'Tidbyt',
        // },
        ];
        // loop over the discovered devices and register each one if it has not already been registered
        for (const device of exampleDevices) {
            // generate a unique id for the accessory this should be generated from
            // something globally unique, but constant, for example, the device serial
            // number or MAC address
            const uuid = this.api.hap.uuid.generate(device.exampleUniqueId);
            // see if an accessory with the same uuid has already been registered and restored from
            // the cached devices we stored in the `configureAccessory` method above
            const existingAccessory = this.accessories.find((accessory) => accessory.UUID === uuid);
            if (existingAccessory) {
                // the accessory already exists
                this.log.info("Restoring existing accessory from cache:", existingAccessory.displayName);
                // if you need to update the accessory.context then you should run `api.updatePlatformAccessories`. eg.:
                // existingAccessory.context.device = device;
                // this.api.updatePlatformAccessories([existingAccessory]);
                // create the accessory handler for the restored accessory
                // this is imported from `platformAccessory.ts`
                new platformAccessory_1.TidbytPlatformAccessory(this, existingAccessory);
                // it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, eg.:
                // remove platform accessories when no longer present
                // this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [existingAccessory]);
                // this.log.info('Removing existing accessory from cache:', existingAccessory.displayName);
            }
            else {
                // the accessory does not yet exist, so we need to create it
                this.log.info("Adding new accessory:", device.exampleDisplayName);
                // create a new accessory
                const accessory = new this.api.platformAccessory(device.exampleDisplayName, uuid);
                // store a copy of the device object in the `accessory.context`
                // the `context` property can be used to store any data about the accessory you may need
                accessory.context.device = device;
                // create the accessory handler for the newly create accessory
                // this is imported from `platformAccessory.ts`
                new platformAccessory_1.TidbytPlatformAccessory(this, accessory);
                // link the accessory to your platform
                this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [
                    accessory,
                ]);
            }
        }
    }
}
exports.TidbytHomebridgePlatform = TidbytHomebridgePlatform;
//# sourceMappingURL=platform.js.map