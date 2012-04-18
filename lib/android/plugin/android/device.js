var channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

/**
 * This represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
function Device() {
    this.available = false;
    this.platform = null;
    this.version = null;
    this.name = null;
    this.uuid = null;
    this.cordova = null;

    var me = this;

    channel.onCordovaReady.subscribeOnce(function() {
        me.getInfo(function(info) {
            me.available = true;
            me.platform = info.platform;
            me.version = info.version;
            me.name = info.name;
            me.uuid = info.uuid;
            me.cordova = info.cordova;
            channel.onCordovaInfoReady.fire();
        },function(e) {
            me.available = false;
            utils.alert("[ERROR] Error initializing Cordova: " + e);
        });
    });
}

/**
 * Get device info
 *
 * @param {Function} successCallback The function to call when the heading data is available
 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
 */
Device.prototype.getInfo = function(successCallback, errorCallback) {

    // successCallback required
    if (typeof successCallback !== "function") {
        console.log("Device Error: successCallback is not a function");
        return;
    }

    // errorCallback optional
    if (errorCallback && (typeof errorCallback !== "function")) {
        console.log("Device Error: errorCallback is not a function");
        return;
    }

    // Get info
    exec(successCallback, errorCallback, "Device", "getDeviceInfo", []);
};

/*
 * DEPRECATED
 * This is only for Android.
 *
 * You must explicitly override the back button.
 */
Device.prototype.overrideBackButton = function() {
    console.log("Device.overrideBackButton() is deprecated.  Use App.overrideBackbutton(true).");
    navigator.app.overrideBackbutton(true);
};

/*
 * DEPRECATED
 * This is only for Android.
 *
 * This resets the back button to the default behaviour
 */
Device.prototype.resetBackButton = function() {
    console.log("Device.resetBackButton() is deprecated.  Use App.overrideBackbutton(false).");
    navigator.app.overrideBackbutton(false);
};

/*
 * DEPRECATED
 * This is only for Android.
 *
 * This terminates the activity!
 */
Device.prototype.exitApp = function() {
    console.log("Device.exitApp() is deprecated.  Use App.exitApp().");
    navigator.app.exitApp();
};

module.exports = new Device();
