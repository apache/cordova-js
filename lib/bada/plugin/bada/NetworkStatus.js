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

var channel = require('cordova/channel'),
    Connection = require("cordova/plugin/Connection");

// We can't tell if a cell connection is 2, 3 or 4G.
// We just know if it's connected and the signal strength
// if it's roaming and the network name etc..so unless WiFi we default to CELL_2G
// if connected to cellular network

module.exports = {
    getConnectionInfo: function(success, fail) {
        var connectionType = Connection.NONE;
        var networkInfo = ["cellular", "wifi"]; // might be a better way to do this
        var gotConnectionInfo = function() {
            networkInfo.pop();
            if(networkInfo.length === 0) {
                channel.onCordovaConnectionReady.fire();
                success(connectionType);
            }
        };
        var error = function(e) {
            console.log("Error "+e.message);
            gotConnectionInfo();
        };
        deviceapis.devicestatus.getPropertyValue(function(value) {
            console.log("Device Cellular network status: "+value);
            if(connectionType === Connection.NONE) {
                connectionType = Connection.CELL_2G;
            }
            gotConnectionInfo();
        }, error, {aspect: "CellularNetwork", property: "signalStrength"});

        deviceapis.devicestatus.getPropertyValue(function(value) {
            console.log("Device WiFi network status: "+value);
            if(value == "connected") {
                connectionType = Connection.WIFI;
            }
            gotConnectionInfo();
        }, error, {aspect: "WiFiNetwork", property: "networkStatus"});
    }
};
