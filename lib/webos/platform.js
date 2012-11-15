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
    id: "webos",
    initialize: function() {
        if (window.PalmSystem) {
            window.PalmSystem.stageReady();
        }
        window.Mojo = window.Mojo || {};
        window.Mojo.stageActivated = function() {
            console.error("stageActivated");
        };
    },
    clobbers: {
        requestFileSystem:{
            path: 'cordova/plugin/webos/requestfilesystem'
        },
        FileReader: {
            path: "cordova/plugin/webos/filereader"
        }
    },
    merges: {
        navigator: {
            children: {
                service: {
                    path: "cordova/plugin/webos/service"
                },
                application: {
                    path: "cordova/plugin/webos/application"
                },
                window: {
                    path: "cordova/plugin/webos/window"
                },
                notification: {
                    path: "cordova/plugin/webos/notification"
                },
                orientation: {
                    path: "cordova/plugin/webos/orientation"
                },
                keyboard: {
                    path: "cordova/plugin/webos/keyboard"
                }
            }
        }
    }
};
