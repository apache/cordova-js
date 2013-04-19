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
    cordova = require('cordova');

// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

module.exports = {
    getDeviceInfo : function(args, win, fail){
        //Register an event handler for the networkChange event
        var callback = blackberry.events.registerEventHandler("deviceInfo", function (info) {
                win({
                    platform: "BlackBerry",
                    version: info.version,
                    model: "PlayBook",
                    name: "PlayBook", // deprecated: please use device.model
                    uuid: info.uuid,
<<<<<<< HEAD
                    cordova: "2.5.0"
=======
                    cordova: "2.7.0rc1"
>>>>>>> 4808bda... Fixed version number
                });
            }),
            request = new blackberry.transport.RemoteFunctionCall("org/apache/cordova/getDeviceInfo");

        request.addParam("id", callback);
        request.makeSyncCall();

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "" };
    }
};
