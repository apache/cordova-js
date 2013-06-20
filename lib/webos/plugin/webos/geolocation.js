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
    //store request handles to avoid garbage collection issues with long requests
    requests: [],
    watched: {},
    getLocation: function(successCallback, failureCallback, options) {
        var request = this.requests[requests.length] = service.Request('palm://com.palm.location', {
            method: "getCurrentPosition",
            parameters: {
                accuracy: ((options[0]==true) ? 1 : 2),
                maximumAge: options[1]
            },
            onSuccess: function(inResponse) {
                var position = {
                    latitude: inResponse.latitude,
                    longitude: inResponse.longitude,
                    altitude: (inResponse.altitude >= 0 ? inResponse.altitude: null),
                    velocity: (inResponse.velocity >= 0 ? inResponse.velocity: null),
                    heading: (inResponse.heading >= 0 ? inResponse.heading: null),
                    accuracy: (inResponse.horizAccuracy >= 0 ? inResponse.horizAccuracy: null),
                    altitudeAccuracy: (inResponse.vertAccuracy >= 0 ? inResponse.vertAccuracy: null),
                    timestamp: new Date().getTime()
                };
                successCallback(position);
                var index = this.requests.indexOf(request);
                if(index >-1) {
                    this.requests.splice(i, 1);
                }
            },
            onFailure: function(inError) {
                failureCallback({code:inError.errorCode || -1, message:inError.errorText || "Unknown GPS error"});
                var index = this.requests.indexOf(request);
                if(index >-1) {
                    this.requests.splice(i, 1);
                }
            }
        });
    },
    addWatch: function(successCallback, failureCallback, options) {
        this.watched[options[0]] = service.Request('palm://com.palm.location', {
            method: "startTracking",
            parameters: {
                accuracy: ((options[1]==true) ? 1 : 2),
                subscribe: true
            },
            onSuccess: function(inResponse) {
                if(inResponse.latitude!=undefined && inResponse.longitude!=undefined) {
                    var position = {
                        latitude: inResponse.latitude,
                        longitude: inResponse.longitude,
                        altitude: (inResponse.altitude >= 0 ? inResponse.altitude: null),
                        velocity: (inResponse.velocity >= 0 ? inResponse.velocity: null),
                        heading: (inResponse.heading >= 0 ? inResponse.heading: null),
                        accuracy: (inResponse.horizAccuracy >= 0 ? inResponse.horizAccuracy: null),
                        altitudeAccuracy: (inResponse.vertAccuracy >= 0 ? inResponse.vertAccuracy: null),
                        timestamp: new Date().getTime()
                    };
                    successCallback(position);
                }
            },
            onFailure: function(inError) {
                var code = inError.errorCode || 3;
                var msgs = [
                    "Success",
                    "Timeout",
                    "Position currently unavailable",
                    "Unknown geolocation error",
                    "No GPS fix, relying on cell/wifi",
                    "No location source; both Google services and GPS are off",
                    "Permission denied",
                    "Application already has a pending message",
                    "Application has been temporarily blacklisted"
                ];
                failureCallback({code:code, message:msgs[code]});
            },
            subscribe: true
        });
    },
    clearWatch: function(successCallback, failureCallback, options) {
        if(this.watched[options[0]]) {
            this.watched[options[0]].cancel();
            delete this.watched[options[0]];
        }
    }
};
