/**
 * this represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
var exec = require('cordova/exec'),
    channel = require('cordova/channel');

 // TODO: pluginize native ios device info so we can call with exec
var Device = function() {
    this.platform = null;
    this.version  = null;
    this.name     = null;
    this.phonegap = null;
    this.uuid     = null;
    try {
      /*
        this.platform = DeviceInfo.platform;
        this.version  = DeviceInfo.version;
        this.name     = DeviceInfo.name;
        this.phonegap = DeviceInfo.gap;
        this.uuid     = DeviceInfo.uuid;
        */
        var me = this;
        exec(function(deviceinfo) {
          me.platform = deviceinfo.platform;
          /* etc. etc. */

          channel.onCordovaInfoReady.fire();
        }, function() {
        },
        'DeviceInfo', 'getInfo', []);
    } catch(e) {
        // TODO: 
    }
    this.available = PhoneGap.available = !!this.uuid;
};

module.exports = new Device();
