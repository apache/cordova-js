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

/*global tizen:false */
var Connection = require('cordova/plugin/Connection');

module.exports = {
    getConnectionInfo: function (successCallback, errorCallback) {
        var cncType = Connection.NONE;
        var infoCount = 0;

        function infoCB() {
            infoCount++;
            if (infoCount > 1)
               successCallback(cncType);
        }

        function errorCB(error) {
           console.log("Error: " + error.code + "," + error.name + "," + error.message);
           infoCB();
        }

        function wifiSuccessCB(wifi) {
            if ((wifi.status === "ON")  && (wifi.ipAddress.length !== 0))
                cncType = Connection.WIFI;
            infoCB();
        }

        function cellularSuccessCB(cell) {
            if ((cncType === Connection.NONE) && (cell.status === "ON") && (cell.ipAddress.length !== 0))
                cncType = Connection.CELL_2G;
            infoCB();
        }

        if (tizen.systeminfo.isSupported('WifiNetwork')) {
            tizen.systeminfo.getPropertyValue('WifiNetwork', wifiSuccessCB, errorCB);
        }

        if (tizen.systeminfo.isSupported('CellularNetwork')) {
            tizen.systeminfo.getPropertyValue('CellularNetwork', cellularSuccessCB, errorCB);
        }
    }
};
