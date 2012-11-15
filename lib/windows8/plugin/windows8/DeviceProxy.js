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

var cordova = require('cordova');
var utils = require('cordova/utils');
var FileError = require('cordova/plugin/FileError');


module.exports = {

    getDeviceInfo:function(win,fail,args) {
        //console.log("NativeProxy::getDeviceInfo");
        var hostNames = Windows.Networking.Connectivity.NetworkInformation.getHostNames();

        var name = "unknown";
        hostNames.some(function (nm) {
            if (nm.displayName.indexOf(".local") > -1) {
                name = nm.displayName.split(".local")[0];
                return true;
            }
        });

        // deviceId aka uuid, stored in Windows.Storage.ApplicationData.current.localSettings.values.deviceId
        var deviceId;
        var localSettings = Windows.Storage.ApplicationData.current.localSettings;

        if (localSettings.values.deviceId != null) {
            deviceId = localSettings.values.deviceId;
        }
        else {
            deviceId = localSettings.values.deviceId = utils.createUUID();;
        }

        setTimeout(function () {
            win({ platform: "windows8", version: "8", name: name, uuid: deviceId, cordova: "2.2.0" });
        }, 0);
    }

};

require("cordova/commandProxy").add("Device",module.exports);
