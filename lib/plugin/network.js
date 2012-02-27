var exec = require('cordova/exec'),
    cordova = require('cordova');

var NetworkConnection = function () {
        this.type = null;
        this._firstRun = true;
        this._timer = null;
        this.timeout = 500;

        var me = this,
            channel = require('cordova/channel');

        this.getInfo(
            function (info) {
                me.type = info;
                if (info === "none") {
                    // set a timer if still offline at the end of timer send the offline event
                    me._timer = setTimeout(function(){
                        me.type = type;
                        cordova.fireWindowEvent("offline");
                        me._timer = null;
                        }, me.timeout);
                } else {
                    // If there is a current offline event pending clear it
                    if (me._timer !== null) {
                        clearTimeout(me._timer);
                        me._timer = null;
                    }
                    cordova.fireWindowEvent("online");
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
