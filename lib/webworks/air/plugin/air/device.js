var channel = require('cordova/channel'),
    cordova = require('cordova');

// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

module.exports = {
    getDeviceInfo : function(args, win, fail){
        win({
            platform: "PlayBook",
            version: blackberry.system.softwareVersion,
            name: blackberry.system.model,
            uuid: blackberry.identity.PIN,
            cordova: "2.1.0rc1"
        });

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "Device info returned" };
    }

};
