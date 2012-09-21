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
    exec = require('cordova/exec'),
    channel = cordova.require("cordova/channel");

module.exports = {
    id: "windows8",
    initialize:function() {

    },
    objects: {
        navigator: {
            children: {
                device: {
                    path:"cordova/plugin/windows8/device",
                    children:{
                        capture:{
                            path:"cordova/plugin/capture"
                        }
                    }
                },
                console: {
                    path: "cordova/plugin/windows8/console"
                }
            }
        }
    },
    merges: {
        MediaFile: {
            path: "cordova/plugin/windows8/MediaFile"
        },
        navigator: {
            children: {
                notification: {
                    path: 'cordova/plugin/windows8/geolocation'
                }
            }
        }
    }
};
