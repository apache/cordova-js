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

var mixin = function(target, source) {
    target = target || {};
    source = source || {};
    for(var x in source) {
        target[x] = source[x];
    }
}

var hasVKeyboard = true;
try {
    deviceInfo = JSON.parse(PalmSystem.deviceInfo);
    hasVKeyboard = !((deviceInfo.platformVersion.indexOf("1.")==0) ||
            (deviceInfo.platformVersion.indexOf("2.")==0));
} catch(e) {}

module.exports = {
    fetchAppId: function() {
        if (window.PalmSystem) {
            // PalmSystem.identifier: <appid> <processid>
            return PalmSystem.identifier.split(" ")[0];
        }
    },
    fetchAppInfo: function() {
        if(!this.appInfo) {
            var readAppInfoFile = function(filepath) {
                if(window.palmGetResource) {
                    try {
                        return palmGetResource(filepath);
                    } catch(e) {
                        console.log("error reading appinfo.json" + e.message);
                    }
                } else {
                    var req = new XMLHttpRequest();
                    req.open('GET', filepath + "?palmGetResource=true", false);
                    req.send(null);
                    if(req.status >= 200 && req.status < 300) {
                        return req.responseText;
                    } else {
                        console.log("error reading appinfo.json");
                    }
                }
            };
            var appID = this.fetchAppId();
            var paths = [
                this.fetchAppRootPath() + "appinfo.json",
                "file:///media/cryptofs/apps/usr/palm/applications/" + appID + "/appinfo.json",
                "file:///usr/palm/applications/" + appID + "/appinfo.json"
            ]; //possible appinfo paths to check
            var index = paths[0].indexOf(appID);
            if(index>-1) {
                paths.unshift(paths[0].substring(0, index) + appID + "/appinfo.json");
            }
            var appInfoJSON = undefined;
            for(var i=0; i<paths.length && !appInfoJSON; i++) {
                appInfoJSON = readAppInfoFile(paths[i]);
            }
            if(appInfoJSON) {
                this.appInfo = enyo.json.parse(appInfoJSON);
            }
        }
        return this.appInfo;
    },
    fetchAppRootPath: function() {
        var base = window.location.href;
        if('baseURI' in window.document) {
            base = window.document.baseURI;
        } else {
            var baseTags = window.document.getElementsByTagName("base");
            if(baseTags.length > 0) {
                base = baseTags[0].href;
            }
        }
        var match = base.match(new RegExp(".*:\/\/[^#]*\/"));
        if(match) {
            return match[0];
        }
        return "";
    },
    localeMonitor: require("cordova/plugin/webos/extras/localemonitor"),
    orientation: require("cordova/plugin/webos/extras/orientation"),
    keyboard: ((hasVKeyboard) ? require("cordova/plugin/webos/extras/keyboard") : undefined),
    window: require("cordova/plugin/webos/extras/window")
};

//mixin all logging functions directly into window.webOS rather than a subobject
mixin(module.exports, require("cordova/plugin/webos/extras/pmloglib"));

/*
 * Supplemental functions for existing modules, but with webOS-exclusive APIs
 */
mixin(navigator.accelerometer, require("cordova/plugin/webos/extras/accelerometer"));
mixin(navigator.notification, require("cordova/plugin/webos/extras/notification"));
