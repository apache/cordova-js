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

//Supplemental functions for existing Notification module

var ua = navigator.userAgent.toLowerCase();
var isLegacy = ((ua.indexOf("webos")>-1) || (ua.indexOf("hpwos")>-1));
var service = (isLegacy) ? undefined : require('cordova/plugin/webos/service');

module.exports = {
    showToast: function(params, callback) {
        var message = params.message || "";
        var icon = params.icon || "";
        var source = webOS.fetchAppId();
        var appId = params.appId || source;
        var toastParams = params.params || {};
        var target = params.target;
        var noaction = params.noaction;
        var stale = params.stale || false;
        var soundClass = params.soundClass || "";
        var soundFile = params.soundFile || "";
        var soundDurationMs = params.soundDurationMs || "";

        if(isLegacy && window.PalmSystem) { //banner notifications for old webOS
            var response = params.response || {banner: true};
                var id = PalmSystem.addBannerMessage(message, JSON.stringify(toastParams), icon,
                        soundClass, soundFile, soundDurationMs);
                callback(id);
        } else {
            if(message.length>60) {
                console.warn("Toast notification message is longer than recommended. May not display as intended");
            }
            var reqParam = {
                sourceId: source,
                message: message,
                stale: stale,
                noaction:noaction
            }
            if(icon && icon.length>0) {
                reqParam.iconUrl = icon
            }
            if(!noaction) {
                if(target) {
                    reqParam.onclick = {target:target};
                } else {
                    reqParam.onclick = {appId:appId, params:toastParams};
                }
            }
            this.showToastRequest = service.request("palm://com.webos.notification", {
                method: "createToast",
                parameters: reqParams,
                onSuccess: function(inResponse) {
                    callback(inResponse.toastId);
                },
                onFailure: function(inError) {
                    console.error("Failed to create toast: " + JSON.stringify(inError));
                    callback();
                }
            });

        }
    },
    removeToast: function(id) {
        if(isLegacy && window.PalmSystem) {
            try {
                PalmSystem.removeBannerMessage(id);
            } catch(e) {
                console.warn(e);
                PalmSystem.clearBannerMessage();
            }
        } else {
            this.removeToastRequest = service.request("palm://com.webos.notification", {
                method: "cancelToast",
                parameters: {toastId:id}
            });
        }
    },

    /*
     * adds a dashboard to the WebOS app
     * @param {String} url
     * @param {String} html
     * Example:
     *     navigator.notification.showDashboard("dashboard.html");
     */
    showDashboard: function(url, html) {
        if(isLegacy) {
            var dash = window.open(url, "_blank", "attributes={\"window\":\"dashboard\"}");
            if(html) {
                dash.document.write(html);
            }
            if(dash.PalmSystem) {
                dash.PalmSystem.stageReady();
            }
            return dash;
        } else {
            console.warn("Dashboards are not supported on this version of webOS.");
        }
    }
};
