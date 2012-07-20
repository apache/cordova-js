var channel = require('cordova/channel');

// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

module.exports = {
    platform: "PlayBook",
    version: blackberry.system.softwareVersion,
    name: blackberry.system.model,
    uuid: blackberry.identity.PIN,
    cordova: "2.0.0"
};

channel.onCordovaInfoReady.fire();
