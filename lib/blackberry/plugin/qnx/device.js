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
        win({
            platform: "BlackBerry",
            version: blackberry.system.softwareVersion,
            model: "Dev Alpha",
            name: "Dev Alpha", // deprecated: please use device.model
            uuid: blackberry.identity.uuid,
            cordova: "2.4.0rc1"
        });

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "Device info returned" };
    }
};
