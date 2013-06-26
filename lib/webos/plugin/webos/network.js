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

var service = require('cordova/plugin/webos/service');
var Connection = require('cordova/plugin/Connection');

//connection monitor
navigator.connectionMonitor = navigator.connectionMonitor || {};
navigator.connectionMonitor.start = function(onSuccess, onFailure) {
    onSuccess = this.onSuccess = onSuccess || this.onSuccess;
    this.onFailure = onFailure || this.onFailure;
    if(!navigator.connectionMonitor.request) {
        navigator.connectionMonitor.request = service.Request('palm://com.palm.connectionmanager', {
            method: 'getstatus',
            parameters: { subscribe: true },
            onSuccess: function(result) {
                var type = Connection.UNKNOWN;
                if(!result.isInternetConnectionAvailable) { type = Connection.NONE; }
                if(result.wan && result.wan.state==="connected") { type = Connection.CELL; }
                if(result.wifi && result.wifi.onInternet) { type = Connection.WIFI; }
                if(result.wired && result.wired.onInternet) { type = Connection.ETHERNET; }

                //check for connection type change to avoid duplicate online/offline events
                if(type != navigator.connection.type) {
                    onSuccess(type);
                }
            },
            onFailure: this.onFailure,
            subscribe: true,
            resubscribe: true
        });
    }
};
navigator.connectionMonitor.stop = function() {
    if(navigator.connectionMonitor.request) {
        navigator.connectionMonitor.request.cancel();
        navigator.connectionMonitor.request = undefined;
    }
};

module.exports = {
    /**
     * Get connection info
     *
     * @param {Function} successCallback The function to call when the Connection data is available
     * @param {Function} errorCallback The function to call when there is an error getting the Connection data. (OPTIONAL)
     */
    getConnectionInfo: function (successCallback, failureCallback) {
        navigator.connectionMonitor.start(successCallback, failureCallback);
    }
};
