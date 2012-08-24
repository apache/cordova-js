/*global tizen:false */
var channel = require('cordova/channel');

// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

function Device() {
    this.version = null;
    this.uuid = null;
    this.name = null;
    this.cordova =  "2.1.0rc1";
    this.platform = "Tizen";

    var me = this;

    function onSuccessCallback(sysInfoProp) {
        me.name = sysInfoProp.model;
        me.uuid = sysInfoProp.imei;
        me.version = sysInfoProp.version;
        channel.onCordovaInfoReady.fire();
    }

    function onErrorCallback(error) {
        console.log("error initializing cordova: " + error);
    }

    channel.onCordovaReady.subscribeOnce(function() {
        me.getDeviceInfo(onSuccessCallback, onErrorCallback);
    });
}

Device.prototype.getDeviceInfo = function(success, fail, args) {
    tizen.systeminfo.getPropertyValue("Device", success, fail);
};

module.exports = new Device();
