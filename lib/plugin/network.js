
/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 * 
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010-2011, IBM Corporation
 */

var channel = require('phonegap/channel'),
    NetworkConnection = function () {
        this.type = null;
        this._firstRun = true;

        var me = this;
        this.getInfo(
            function (info) {
                me.type = info.type;
                if (typeof info.event !== "undefined") {
                    PhoneGap.fireEvent(info.event);
                }

                // should only fire this once
                if (me._firstRun) {
                    me._firstRun = false;
                    channel.onPhoneGapConnectionReady.fire();
                }
            },
            function (e) {
                // If we can't get the network info we should still tell PhoneGap
                // to fire the deviceready event.
                if (me._firstRun) {
                    me._firstRun = false;
                    channel.onPhoneGapConnectionReady.fire();
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
    PhoneGap.exec(successCallback, errorCallback, "Network Status", "getConnectionInfo", []);
};

module.exports = new NetworkConnection();
