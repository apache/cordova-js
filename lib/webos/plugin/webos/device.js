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

module.exports = {
    getDeviceInfo: function(successCallback, failureCallback) {
        var deviceInfo = undefined;
        try {
            deviceInfo = JSON.parse(PalmSystem.deviceInfo);
        } catch(e) {
            failureCallback(e)
        }
        service.Request('palm://com.palm.preferences/systemProperties', {
            method:"Get",
            parameters:{"key": "com.palm.properties.nduid"},
            onSuccess: function(result) {
                successCallback({
                    name: deviceInfo.modelName,
                    model: deviceInfo.modelName,
                    version: deviceInfo.platformVersion,
                    platform: "webOS",
                    cordova: "2.7.0",
                    uuid: result["com.palm.properties.nduid"]
                });
            },
            onFailure: function(err) {
                successCallback({
                    name: deviceInfo.modelName,
                    model: deviceInfo.modelName,
                    version: deviceInfo.platformVersion,
                    platform: "webOS",
                    cordova: "2.7.0",
                    uuid: ""
                });
            }
        });
    }
};
