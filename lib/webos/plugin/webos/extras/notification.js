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

var isLegacy = ((navigator.userAgent.indexOf("webOS")>-1) || (navigator.userAgent.indexOf("hpwOS")>-1));
var service = (isLegacy) ? undefined : require('cordova/plugin/webos/service');

/*
 * navigator.notification.* namespace
 */
module.exports = {
    /**
     * Shows a temporary toast message via the system
     *
     * @param {Object} params               Toast notification parameters, including:
     *                                          {String}  message       Message to display.
     *                                          {String}  icon          Icon url for the notification. (OPTIONAL)
     *                                          {String}  appId         AppID of app to launch when toast is clicked.
     *                                                                  Only needed to specific a different appID than current app.
     *                                                                  (OPTIONAL, does not work on old webOS 1.x-3.x and Open webOS)
     *                                          {Object}  params        Launch parameters to send when clicked. (OPTIONAL)
     *                                          {String}  target        A valid webOS mime type. An alternative to appId and params.
     *                                                                  (OPTIONAL, does not work on old webOS 1.x-3.x and Open webOS)
     *                                          {Boolean} noaction      If clicking the toast should do nothing.
     *                                                                  (OPTIONAL, does not work on old webOS 1.x-3.x and Open webOS)
     *                                          {Boolean} stale         If true, it's not actively displayed as a new notification.
     *                                                                  (OPTIONAL, does not work on old webOS 1.x-3.x and Open webOS)
     *                                          {String}  soundClass    System class of sound to play on notification.
     *                                                                  (OPTIONAL, old webOS 1.x-3.x and Open webOS only)
     *                                          {String}  soundFile     Sound filepath of file to play on notification.
     *                                                                  (OPTIONAL, old webOS 1.x-3.x and Open webOS only)
     *                                          {String}  soundDuration Duration for the sound to play on notification.
     *                                                                  (OPTIONAL, old webOS 1.x-3.x and Open webOS only)
     * @param {Function} callback           The function to call once the toast notification is initialized. (OPTIONAL)
     *                                      The toast notification's ID is passed to this function, usable by removeToast.
     */
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
                callback && callback(id);
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
                parameters: reqParam,
                onSuccess: function(inResponse) {
                    callback && callback(inResponse.toastId);
                },
                onFailure: function(inError) {
                    console.error("Failed to create toast: " + JSON.stringify(inError));
                    callback && callback();
                }
            });

        }
    },

    /**
     * Removes a toast notification
     *
     * @param {String} id                   ID of the toast to remove
     */
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

    /**
     * Checks whether or not the current device supports creation of dashboard windows.
     *
     * @return Boolean                      Whether or not dashboard windows are supported.
     */
    supportsDashboard: function() {
        return isLegacy;
    },

    /**
     * Creates a dashboard window. (Only works on old webOS and Open webOS)
     *
     * @param {String} url                  URL for an HTML file to be loaded into the dashboard. (OPTIONAL)
     * @param {Function} html               HTML code to inject into the dashboard window. (OPTIONAL)
     * @return Object                       Window object of the child window for the dashboard
     */
    showDashboard: function(url, html) {
        var modulemapper = require('cordova/modulemapper');
        var origOpen = modulemapper.getOriginalSymbol(window, 'open');
        if(isLegacy) {
            var dash = origOpen(url, "_blank", "attributes={\"window\":\"dashboard\"}");
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
