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

var service=require('cordova/plugin/webos/service'),
    cordova = require('cordova');

module.exports = {
    id: "webos",
    initialize: function() {
        var modulemapper = require('cordova/modulemapper');

        modulemapper.loadMatchingModules(/cordova.*\/symbols$/);
        modulemapper.mapModules(window);

        if (window.PalmSystem) {
            window.PalmSystem.stageReady();
        }

        var Mojo = window.Mojo || {};

        // wait for deviceready before listening and firing document events
        document.addEventListener("deviceready", function () {

            // LunaSysMgr calls this when the windows is maximized or opened.
            window.Mojo.stageActivated = function() {
                console.log("stageActivated");
                cordova.fireDocumentEvent("resume");
            };
            // LunaSysMgr calls this when the windows is minimized or closed.
            window.Mojo.stageDeactivated = function() {
                console.log("stageDeactivated");
                cordova.fireDocumentEvent("pause");
            };
            // LunaSysMgr calls this when a KeepAlive app's window is hidden
            window.Mojo.hide = function() {
                console.log("hide");
            };
            // LunaSysMgr calls this when a KeepAlive app's window is shown
            window.Mojo.show = function() {
                console.log("show");
            };

            // LunaSysMgr calls this whenever an app is "launched;"
            window.Mojo.relaunch = function() {
                // need to return true to tell sysmgr the relaunch succeeded.
                // otherwise, it'll try to focus the app, which will focus the first
                // opened window of an app with multiple windows.

                var lp=JSON.parse(PalmSystem.launchParams) || {};

                if (lp['palm-command'] && lp['palm-command'] == 'open-app-menu') {
                    console.log("event:ToggleAppMenu");
                    cordova.fireDocumentEvent("menubutton");
                }

                console.log("relaunch");
                return true;
            };

            // start to listen for network connection changes
            service.Request('palm://com.palm.connectionmanager', {
                method: 'getstatus',
                parameters: { subscribe: true },
                onSuccess: function (result) {
                    console.log("subscribe:result:"+JSON.stringify(result));

                    if (!result.isInternetConnectionAvailable) {
                        if (navigator.onLine) {
                            console.log("Firing event:offline");
                            cordova.fireDocumentEvent("offline");
                        }
                    } else {
                        console.log("Firing event:online");
                        cordova.fireDocumentEvent("online");
                    }
                },
                onFailure: function(e) {
                    console.error("subscribe:error");
                }
            });

        });
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
