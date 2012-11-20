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

module.exports = {
    id: "ios",
    initialize:function() {
        // iOS doesn't allow reassigning / overriding navigator.geolocation object.
        // So clobber its methods here instead :)
        var geo = require('cordova/plugin/geolocation');

        navigator.geolocation.getCurrentPosition = geo.getCurrentPosition;
        navigator.geolocation.watchPosition = geo.watchPosition;
        navigator.geolocation.clearWatch = geo.clearWatch;
    },
    clobbers: {
        File: { // exists natively, override
            path: "cordova/plugin/File"
        },
        FileReader: { // exists natively, override
            path: "cordova/plugin/FileReader"
        },
        MediaError: { // exists natively, override
            path: "cordova/plugin/MediaError"
        },
        console: {
            path: 'cordova/plugin/ios/console'
        },
        open : {
            path: 'cordova/plugin/InAppBrowser'
        }
    },
    merges:{
        Contact:{
            path: "cordova/plugin/ios/Contact"
        },
        Entry:{
            path: "cordova/plugin/ios/Entry"
        },
        FileReader:{
            path: "cordova/plugin/ios/FileReader"
        },
        navigator:{
            children:{
                notification:{
                    path:"cordova/plugin/ios/notification"
                },
                contacts:{
                    path:"cordova/plugin/ios/contacts"
                }
            }
        }
    }
};

// use the native logger
var logger = require("cordova/plugin/logger");
logger.useConsole(false);
