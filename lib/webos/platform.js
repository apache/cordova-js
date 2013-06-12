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

/*global Mojo:false */

var service=require('cordova/plugin/webos/service'),
    cordova = require('cordova');

module.exports = {
    id: "webos",
    initialize: function() {
        var modulemapper = require('cordova/modulemapper');

        modulemapper.loadMatchingModules(/cordova.*\/symbols$/);

        modulemapper.merges('cordova/plugin/webos/service', 'navigator.service');
        modulemapper.merges('cordova/plugin/webos/application', 'navigator.application');
        modulemapper.merges('cordova/plugin/webos/window', 'navigator.window');
        modulemapper.merges('cordova/plugin/webos/orientation', 'navigator.orientation');
        modulemapper.merges('cordova/plugin/webos/keyboard', 'navigator.keyboard');
        modulemapper.merges('cordova/plugin/webos/pmloglib', 'window.webOS');

        modulemapper.mapModules(window);

        if (window.PalmSystem) {
            window.PalmSystem.stageReady();
        }

        // create global Mojo object if it does not exist
        Mojo = window.Mojo || {};

        //connection monitor subscription
        navigator.connectionMonitor = navigator.connectionMonitor || {};
        navigator.connectionMonitor.start = function() {
            navigator.connectionMonitor.request = service.Request('palm://com.palm.connectionmanager', {
                method: 'getstatus',
                parameters: { subscribe: true },
                onSuccess: function (result) {
                    console.log("subscribe:result:"+JSON.stringify(result));
                    if(!result.isInternetConnectionAvailable) {
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
                },
                subscribe: true,
                resubscribe: true
            });
        };
        navigator.connectionMonitor.start();

        //locale monitor subscription
        navigator.localeMonitor = navigator.localeMonitor || {};
        navigator.localeMonitor.start = function() {
            navigator.localeMonitor.request = service.Request('palm://com.palm.systemservice', {
                method: 'getPreferences',
                parameters: {
                    keys: ["localeInfo"],
                },
                onSuccess: function (inResponse) {
                    if(navigator.localeInfo) {
                        if((navigator.localeInfo.locales.UI !== inResponse.localeInfo.locales.UI) ||
                                (navigator.localeInfo.timezone !== inResponse.localeInfo.timezone) ||
                                (navigator.localeInfo.clock !== inResponse.localeInfo.clock)) {
                            console.log("Firing event:localechange");
                            cordova.fireDocumentEvent("localechange");
                        }
                    }
                    navigator.localeInfo = inResponse.localeInfo;
                },
                onFailure: function(e) {
                    console.error("subscribe:error");
                },
                subscribe: true,
                resubscribe: true
            });
        };
        navigator.localeMonitor.start();

        // wait for deviceready before listening and firing document events
        document.addEventListener("deviceready", function () {

            // LunaSysMgr calls this when the windows is maximized or opened.
            window.Mojo.stageActivated = function() {
                console.log("stageActivated");
                cordova.fireDocumentEvent("resume");
                // start to listen for network connection changes if needed
                if(!navigator.connectionMonitor.request) {
                    navigator.connectionMonitor.start();
                }

                // start to listen for locale info changes if needed
                if(!navigator.localeMonitor.request) {
                    navigator.localeMonitor.start();
                }
            };
            // LunaSysMgr calls this when the windows is minimized or closed.
            window.Mojo.stageDeactivated = function() {
                console.log("stageDeactivated");
                cordova.fireDocumentEvent("pause");
                // stop subscription-based monitors on stage deactivation
                if(navigator.connectionMonitor.request) {
                    navigator.connectionMonitor.request.cancel();
                    navigator.connectionMonitor.request = undefined;
                }
                if(navigator.localeMonitor.request) {
                    navigator.localeMonitor.request.cancel();
                    navigator.localeMonitor.request = undefined;
                }
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
        });
    }
};
