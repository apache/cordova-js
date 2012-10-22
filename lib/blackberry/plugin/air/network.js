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

var cordova = require('cordova'),
    connection = require('cordova/plugin/Connection');

module.exports = {
    getConnectionInfo: function (args, win, fail) {
        var connectionType = connection.NONE,
            eventType = "offline",
            callbackID,
            request;

        /**
         * For PlayBooks, we currently only have WiFi connections, so
         * return WiFi if there is any access at all.
         * TODO: update if/when PlayBook gets other connection types...
         */
        if (blackberry.system.hasDataCoverage()) {
            connectionType = connection.WIFI;
            eventType = "online";
        }

        //Register an event handler for the networkChange event
        callbackID = blackberry.events.registerEventHandler("networkChange", function (status) {
            win(status.type);
        });

        //pass our callback id down to our network extension
        request = new blackberry.transport.RemoteFunctionCall("org/apache/cordova/getConnectionInfo");
        request.addParam("networkStatusChangedID", callbackID);
        request.makeSyncCall();

        return { "status": cordova.callbackStatus.OK, "message": connectionType};
    }
};
