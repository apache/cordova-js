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

var Acceleration = require('cordova/plugin/Acceleration');

module.exports = {
    getCurrentAcceleration: function(successCallback, errorCallback, options) {
        var success = function(acceleration) {
            console.log("Accelerometer:getAcceleration:success");
            var accel = new Acceleration(acceleration.xAxis, acceleration.yAxis, acceleration.zAxis);
            successCallback(accel);
        };
        var error = function(err) {
            console.log("Accelerometer:getAcceleration:error");
            if (err.code == err.TYPE_MISMATCH_ERR) {
                console.log("TYPE MISMATCH ERROR");
            }

            errorCallback(err);
        };
        deviceapis.accelerometer.getCurrentAcceleration(success, error);
    },
    watchAcceleration: function(successCallback, errorCallback, options) {
        var success = function(acceleration) {
            console.log("accelerometer:watchAcceleration:success");
            var accel = new Acceleration(acceleration.xAxis, acceleration.yAxis, acceleration.zAxis);
            successCallback(accel);
        };
        var error = function(err) {
            console.log("accelerometer:watchAcceleration:error");
            errorCallback(err);
        };
        return deviceapis.accelerometer.watchAcceleration(success, error);
    },
    clearWatch: function(watchID) {
        deviceapis.accelerometer.clearWatch(watchID);
    }
};
