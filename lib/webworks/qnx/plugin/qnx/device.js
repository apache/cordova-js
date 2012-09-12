var channel = require('cordova/channel'),
    cordova = require('cordova');

// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

module.exports = {
    getDeviceInfo : function(args, win, fail){
        win({
            platform: "BB10",
            version: blackberry.system.softwareVersion,
            name: "Dev Alpha",
            uuid: blackberry.identity.uuid,
            cordova: "2.1.0"
        });

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "Device info returned" };
    }
};
