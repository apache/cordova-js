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

var service=require('cordova/plugin/webos/service');

module.exports = {

getLocation: function(successCallback, errorCallback, options) {
    console.error("webos plugin geolocation getlocation");
    var request=service.Request('palm://com.palm.location', {
        method: "getCurrentPosition",
        onSuccess: function(event) {
            var alias={};
            alias.lastPosition = {
                coords: {
                    latitude: event.latitude,
                    longitude: event.longitude,
                    altitude: (event.altitude >= 0 ? event.altitude: null),
                    speed: (event.velocity >= 0 ? event.velocity: null),
                    heading: (event.heading >= 0 ? event.heading: null),
                    accuracy: (event.horizAccuracy >= 0 ? event.horizAccuracy: null),
                    altitudeAccuracy: (event.vertAccuracy >= 0 ? event.vertAccuracy: null)
                },
                timestamp: new Date().getTime()
            };

            successCallback(alias.lastPosition);
        },
        onFailure: function() {
            errorCallback();
        }
    });

}

};

