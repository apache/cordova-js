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
    id: 'webos',
    bootstrap: function() {
        require('cordova/modulemapper').clobbers('cordova/exec/proxy', 'cordova.commandProxy');
        require('cordova/channel').onNativeReady.fire();
    },
    initialize: function() {
        var isLegacy = ((navigator.userAgent.indexOf("webOS")>-1) || (navigator.userAgent.indexOf("hpwOS")>-1));
        var externalWebOSLib = (window.webOS!==undefined);
        if(!externalWebOSLib && window.PalmSystem && isLegacy) {
            window.PalmSystem.stageReady();
        }

        // temporary workaround for webOS issue GF-41155; remove once fixed at a lower level
        var pauseListeners = [];
        var resumeListeners = [];
        var origAddEventListener = document.addEventListener;
        var origRemoveEventListener = document.removeEventListener;
        document.addEventListener = function(type, handler) {
            if(type=="pause") {
                pauseListeners.push(handler);
            } else if(type=="resume") {
                resumeListeners.push(handler);
            } else {
                origAddEventListener.apply(document, arguments);
            }
        };
        document.removeEventListener = function(type, handler) {
            if(type=="pause") {
                var iPause = pauseListeners.indexOf(handler);
                if(iPause>-1) {
                    pauseListeners.splice(iPause, 1);
                }
            } else if(type=="resume") {
                var iResume = resumeListeners.indexOf(handler);
                if(iResume>-1) {
                    resumeListeners.splice(iResume, 1);
                }
            } else {
                origRemoveEventListener.apply(document, arguments);
            }
        };
        var fireEventSync = function(eName, eHandlers) {
            for(var i=0; i<eHandlers.length; i++) {
                eHandlers[i] && eHandlers[i]({type:eName});
            }
        };

        // create global Mojo object if it does not exist
        window.Mojo = window.Mojo || {};

        // wait for deviceready before listening and firing document events
        document.addEventListener("deviceready", function () {
            // Check for support for page visibility api
            if(typeof document.webkitHidden !== "undefined") {
                document.addEventListener("webkitvisibilitychange", function(e) {
                    if(document.webkitHidden) {
                        //cordova.fireDocumentEvent("pause");
                        fireEventSync("pause", pauseListeners);
                    } else {
                        //cordova.fireDocumentEvent("resume");
                        fireEventSync("resume", resumeListeners);
                    }
                });
            } else {
                // LunaSysMgr calls this when the windows is maximized or opened.
                window.Mojo.stageActivated = function() {
                    window.cordova.fireDocumentEvent("resume");
                };
                // LunaSysMgr calls this when the windows is minimized or closed.
                window.Mojo.stageDeactivated = function() {
                    window.cordova.fireDocumentEvent("pause");
                };
            }

            if(isLegacy && !externalWebOSLib) {
                var lp = JSON.parse(PalmSystem.launchParams || "{}") || {};
                window.cordova.fireDocumentEvent("webOSLaunch", {type:"webOSLaunch", detail:lp});
                // LunaSysMgr calls this whenever an app is "launched;"
                window.Mojo.relaunch = function(e) {
                    var lp = JSON.parse(PalmSystem.launchParams || "{}") || {};
                    if(lp['palm-command'] && lp['palm-command'] == 'open-app-menu') {
                        window.cordova.fireDocumentEvent("menubutton");
                        return true;
                    } else {
                        window.cordova.fireDocumentEvent("webOSRelaunch", {type:"webOSRelaunch", detail:lp});
                    }
                };
            }
            document.addEventListener("keydown", function(e) {
                // back gesture/button varies by version and build
                if(e.keyCode == 27 || e.keyCode == 461 || e.keyIdentifier == "U+1200001" ||
                        e.keyIdentifier == "U+001B" || e.keyIdentifier == "Back") {
                    window.cordova.fireDocumentEvent("backbutton", e);
                }
            });
        });
    }
};
