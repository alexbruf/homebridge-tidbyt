"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TidbytTVAccessory = void 0;
const settings_1 = require("./settings");
class TidbytTVAccessory {
    api;
    platform;
    accessory;
    log;
    pixletUrl;
    service;
    state = "UNSET";
    options = [];
    constructor(api, platform, accessory, log, pixletUrl) {
        this.api = api;
        this.platform = platform;
        this.accessory = accessory;
        this.log = log;
        this.pixletUrl = pixletUrl;
        // set accessory information
        this.accessory
            .getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, "Default-Manufacturer")
            .setCharacteristic(this.platform.Characteristic.Model, "Default-Model")
            .setCharacteristic(this.platform.Characteristic.SerialNumber, "My-Serial");
        this.service =
            this.accessory.getService(this.platform.Service.Television) ||
                this.accessory.addService(this.platform.Service.Television);
    }
    async register() {
        this.service.setCharacteristic(this.platform.Characteristic.Name, this.accessory.context.device.exampleDisplayName);
        this.service.setCharacteristic(this.platform.Characteristic.SleepDiscoveryMode, this.platform.Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);
        this.service
            .getCharacteristic(this.platform.Characteristic.ActiveIdentifier)
            .onSet((newValue) => {
            // the value will be the value you set for the Identifier Characteristic
            // on the Input Source service that was selected - see input sources below.
            this.log.info("set Active Identifier => setNewValue: " + newValue);
            const option = this.options[parseInt(newValue.toString()) - 1];
            this.setState(option);
        });
        this.service
            .getCharacteristic(this.platform.Characteristic.RemoteKey)
            .onSet((newValue) => {
            switch (newValue) {
                case this.platform.Characteristic.RemoteKey.REWIND: {
                    this.log.info("set Remote Key Pressed: REWIND");
                    break;
                }
                case this.platform.Characteristic.RemoteKey.FAST_FORWARD: {
                    this.log.info("set Remote Key Pressed: FAST_FORWARD");
                    break;
                }
                case this.platform.Characteristic.RemoteKey.NEXT_TRACK: {
                    this.log.info("set Remote Key Pressed: NEXT_TRACK");
                    break;
                }
                case this.platform.Characteristic.RemoteKey.PREVIOUS_TRACK: {
                    this.log.info("set Remote Key Pressed: PREVIOUS_TRACK");
                    break;
                }
                case this.platform.Characteristic.RemoteKey.ARROW_UP: {
                    this.log.info("set Remote Key Pressed: ARROW_UP");
                    break;
                }
                case this.platform.Characteristic.RemoteKey.ARROW_DOWN: {
                    this.log.info("set Remote Key Pressed: ARROW_DOWN");
                    break;
                }
                case this.platform.Characteristic.RemoteKey.ARROW_LEFT: {
                    this.log.info("set Remote Key Pressed: ARROW_LEFT");
                    break;
                }
                case this.platform.Characteristic.RemoteKey.ARROW_RIGHT: {
                    this.log.info("set Remote Key Pressed: ARROW_RIGHT");
                    break;
                }
                case this.platform.Characteristic.RemoteKey.SELECT: {
                    this.log.info("set Remote Key Pressed: SELECT");
                    break;
                }
                case this.platform.Characteristic.RemoteKey.BACK: {
                    this.log.info("set Remote Key Pressed: BACK");
                    break;
                }
                case this.platform.Characteristic.RemoteKey.EXIT: {
                    this.log.info("set Remote Key Pressed: EXIT");
                    break;
                }
                case this.platform.Characteristic.RemoteKey.PLAY_PAUSE: {
                    this.log.info("set Remote Key Pressed: PLAY_PAUSE");
                    break;
                }
                case this.platform.Characteristic.RemoteKey.INFORMATION: {
                    this.log.info("set Remote Key Pressed: INFORMATION");
                    break;
                }
            }
        });
        const options = await this.getOptions();
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const inputService = this.accessory.addService(this.platform.Service.InputSource, option, option);
            inputService
                .setCharacteristic(this.platform.Characteristic.Identifier, i + 1)
                .setCharacteristic(this.platform.Characteristic.ConfiguredName, option)
                .setCharacteristic(this.platform.Characteristic.IsConfigured, this.platform.Characteristic.IsConfigured.CONFIGURED)
                .setCharacteristic(this.platform.Characteristic.InputSourceType, this.platform.Characteristic.InputSourceType.HDMI);
            this.service.addLinkedService(inputService);
        }
        this.api.publishExternalAccessories(settings_1.PLUGIN_NAME + "-" + this.accessory.displayName, [this.accessory]);
        // set the default state
        if (this.options.length > 0) {
            await this.setState(this.options[0]);
        }
    }
    async setState(state) {
        if (this.state === state) {
            return;
        }
        // check if state is in options
        if (!this.options.includes(state)) {
            this.log.error("Invalid state: " + state);
            return;
        }
        const response = await fetch(this.pixletUrl + `/api/v1/push/${state}`, {
            method: "POST",
        });
        const result = await response.json();
        this.log.info("Response: " + JSON.stringify(result));
        this.state = state;
    }
    async getOptions() {
        if (this.options.length > 0) {
            return this.options;
        }
        const response = await fetch(this.pixletUrl + "/api/v1/push/files");
        const result = await response.json();
        this.options = result.files;
        return this.options;
    }
}
exports.TidbytTVAccessory = TidbytTVAccessory;
//# sourceMappingURL=tidbytTv.js.map