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

        //navigator.service.request required for Cordova core to function
        modulemapper.merges('cordova/plugin/webos/service', 'navigator.service');

        //webos module loads additional webOS-specific core features on top of Cordova core featureset
        modulemapper.merges('cordova/plugin/webos/extras/webos', 'webOS');

        modulemapper.mapModules(window);

        if (window.PalmSystem) {
            window.PalmSystem.stageReady();
        }

        // create global Mojo object if it does not exist
        Mojo = window.Mojo || {};

        // wait for deviceready before listening and firing document events
        document.addEventListener("deviceready", function () {
            // Check for support for page visibility api
            if(typeof document.webkitHidden !== "undefined") {
                document.addEventListener("webkitvisibilitychange", function(e) {
                    if(document.webkitHidden) {
                        cordova.fireDocumentEvent("resume");
                    } else {
                        cordova.fireDocumentEvent("pause");
                    }
                });
            
            } else {
                // LunaSysMgr calls this when the windows is maximized or opened.
                window.Mojo.stageActivated = function() {
                    cordova.fireDocumentEvent("resume");
                };
                // LunaSysMgr calls this when the windows is minimized or closed.
                window.Mojo.stageDeactivated = function() {
                    cordova.fireDocumentEvent("pause");
                };
                
                //emulate new webOS.launch event on old devices, which coincidentally
                //don't support the new page visibility api
                var lp = JSON.parse(PalmSystem.launchParams) || {};
                cordova.fireDocumentEvent("webOSLaunch", {type:"webOSLaunch", detail:lp});
                
                // LunaSysMgr calls this whenever an app is "launched;"
                window.Mojo.relaunch = function(e) {
                    var lp = JSON.parse(PalmSystem.launchParams) || {};
                    if(lp['palm-command'] && lp['palm-command'] == 'open-app-menu') {
                        cordova.fireDocumentEvent("menubutton");
                        return true;
                    } else {
                        cordova.fireDocumentEvent("webOSRelaunch", {type:"webOSRelaunch", detail:lp});
                    }
                };
            }
        });
    }
};
