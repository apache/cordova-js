var me = {},
    exec = require('cordova/exec'),
    channel = require('cordova/channel');

channel.onCordovaReady.subscribeOnce(function() {
    exec(function (device) {
        me.platform = device.platform;
        me.version  = device.version;
        me.name     = device.name;
        me.uuid     = device.uuid;
        me.cordova  = device.cordova;

        channel.onCordovaInfoReady.fire();
    },
    function (e) {
        console.log("error initializing cordova: " + e);
    },
    "Device",
    "getDeviceInfo",
    []
    );
});

module.exports = me;
