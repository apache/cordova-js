/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec'),
    cordova = require('cordova'),
    channel = require('cordova/channel');

var NetworkConnection = function () {
    this.type = null;
    this._firstRun = true;
    this._timer = null;
    this.timeout = 500;

    var me = this;

    channel.onCordovaReady.subscribe(function() {
        me.getInfo(function (info) {
            me.type = info;
            if (info === "none") {
                // set a timer if still offline at the end of timer send the offline event
                me._timer = setTimeout(function(){
                    cordova.fireDocumentEvent("offline");
                    me._timer = null;
                    }, me.timeout);
            } else {
                // If there is a current offline event pending clear it
                if (me._timer !== null) {
                    clearTimeout(me._timer);
                    me._timer = null;
                }
                cordova.fireDocumentEvent("online");
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
    exec(successCallback, errorCallback, "NetworkStatus", "getConnectionInfo", []);
};

module.exports = new NetworkConnection();
