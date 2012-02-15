var exec = require('cordova/exec'),
    cordova = require('cordova');

var NetworkConnection = function () {
        this.type = null;
        this._firstRun = true;

        var me = this,
            channel = require('cordova/channel');

        this.getInfo(
            function (info) {
                me.type = info.type;
                if (typeof info.event !== "undefined") {
                    cordova.fireWindowEvent(info.event);
                }

                // should only fire this once
                if (me._firstRun) {
                    me._firstRun = false;
                    channel.onCordovaConnectionReady.fire();
                }
            },
            function (e) {
                // If we can't get the network info we should still tell Cordova
                // to fire the deviceready event.
                if (me._firstRun) {
                    me._firstRun = false;
                    channel.onCordovaConnectionReady.fire();
                }
                console.log("Error initializing Network Connection: " + e);
            });
};

/**
 * Get connection info
 *
 * @param {Function} successCallback The function to call when the Connection data is available
 * @param {Function} errorCallback The function to call when there is an error getting the Connection data. (OPTIONAL)
 */
NetworkConnection.prototype.getInfo = function (successCallback, errorCallback) {
    // Get info
    exec(successCallback, errorCallback, "Network Status", "getConnectionInfo", []);
};

module.exports = new NetworkConnection();
