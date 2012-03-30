/**
 * this represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
 
console.log("device is being added");

var cordova = require("cordova");
var exec = require('cordova/exec'),
    channel = require('cordova/channel');
var utils = require('cordova/utils');	


var Device = function() {
	console.log("device constructor");
    this.platform = null;
    this.version  = null;
    this.name     = null;
    this.cordova  = null;
    this.uuid     = null;
	
	var me = this;
    this.getInfo(function (res) {
			console.log("Device.gotInfo::" + res);
            var info = JSON.parse(res);
            console.log("GotDeviceInfo :: " + info.version);
            me.available = true;
            me.platform = info.platform;
            me.version = info.version;
            me.name = info.name;
            me.uuid = info.uuid;
            me.cordova = info.cordova;

            channel.onCordovaInfoReady.fire();
        },
        function(e) {
            me.available = false;
            console.log("Error initializing Cordova: " + e);
        });
	
};

/**
 * Get device info
 *
 * @param {Function} successCallback The function to call when the heading data is available
 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
 */
Device.prototype.getInfo = function(successCallback, errorCallback) {

	console.log("device.getInfo");
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
    //exec(successCallback, errorCallback, "Device", "Get");
};

Device.prototype.setInfo = function(info) {
	console.log("setting device info " + info);
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

console.log("device is live + done");
