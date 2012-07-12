var channel = require('cordova/channel'),
    utils = require('cordova/utils');

// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

function Device() {
    this.platform = null;
    this.version = null;
    this.name = null;
    this.uuid = null;
    this.cordova = null;

    var me = this;

    channel.onCordovaReady.subscribeOnce(function() {
       me.getInfo(function (device) {
           me.platform = device.platform;
           me.version  = device.version;
           me.name     = device.name;
           me.uuid     = device.uuid;
           me.cordova  = device.cordova;

           channel.onCordovaInfoReady.fire();
       },
       function (e) {
           me.available = false;
           utils.alert("error initializing cordova: " + e);
       });
    });
}


Device.prototype.getInfo = function(success, fail, args) {
   var info = deviceapis.devicestatus;
   var properties = ["name", "uuid", "os_name", "os_vendor", "os_version"];

   var me = this;

   var name = null,
       platform = null,
       uuid = null,
       os_name = null,
       os_version = null,
       os_vendor = null;

   var checkProperties = function() {
       properties.pop();
       if(properties.length === 0) {
           me.name = name;
           me.platform = os_vendor + " " + os_name;
           me.version = os_version;
           me.uuid = uuid;
           me.cordova = "1.9.0";
           success(me);
       }
   };

   info.getPropertyValue(function(value) {
           //console.log("Device IMEI: "+value);
           uuid = value;
           checkProperties();
           }, fail, {aspect: "Device", property: "imei"});
   info.getPropertyValue(function(value) {
           //console.log("Device name: "+value);
           name = value;
           checkProperties();
           }, fail, {aspect: "Device", property: "version"});
   info.getPropertyValue(function(value) {
           //console.log("OperatingSystem name: "+value);
           os_name = value;
           checkProperties();
           }, fail, {aspect: "OperatingSystem", property: "name"});
   info.getPropertyValue(function(value) {
           //console.log("OperatingSystem version: "+value);
           os_version = value;
           checkProperties();
           }, fail, {aspect: "OperatingSystem", property: "version"});
   info.getPropertyValue(function(value) {
           //console.log("OperatingSystem vendor: "+value);
           os_vendor = value;
           checkProperties();
           }, fail, {aspect: "OperatingSystem", property: "vendor"});
};

module.exports = new Device();
