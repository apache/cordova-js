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

var service=require('cordova/plugin/webos/service'),
    Connection = require('cordova/plugin/Connection');

module.exports = {
    /**
     * Get connection info
     *
     * @param {Function} successCallback The function to call when the Connection data is available
     * @param {Function} errorCallback The function to call when there is an error getting the Connection data. (OPTIONAL)
     */
    getConnectionInfo: function (successCallback, errorCallback) {
        // Get info
        console.log("webos Plugin: NetworkStatus - getConnectionInfo");

        service.Request('palm://com.palm.connectionmanager', {
            method: 'getstatus',
            parameters: {},
            onSuccess: function (result) {
                console.log("result:"+JSON.stringify(result));

                var info={};
                if (!result.isInternetConnectionAvailable) { info.type=Connection.NONE; }
                if (result.wifi && result.wifi.onInternet) { info.type=Connection.WIFI; }
                if (result.wired && result.wired.onInternet) { info.type=Connection.ETHERNET; }
                if (result.wan && result.wan.state==="connected") { info.type=Connection.CELL_2G; }

                successCallback(info.type);
            },
            onFailure: errorCallback
        });
    }
};
