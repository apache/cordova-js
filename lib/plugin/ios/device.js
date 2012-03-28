/**
 * this represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
var exec = require('cordova/exec'),
    channel = require('cordova/channel');

var Device = function() {
    this.platform = null;
    this.version  = null;
    this.name     = null;
    this.cordova  = null;
    this.uuid     = null;
};

Device.prototype.setInfo = function(info) {
    try {
        this.platform = info.platform;
        this.version = info.version;
        this.name = info.name;
        this.cordova = info.gap;
        this.uuid = info.uuid;
        channel.onCordovaInfoReady.fire();
    } catch(e) {
        alert('Error during device info setting in cordova/plugin/ios/device!');
    }
};

module.exports = new Device();
