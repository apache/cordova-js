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
    /*
     * adds a dashboard to the WebOS app
     * @param {String} url
     * @param {String} html
     * Example:
     *        navigator.notification.newDashboard("dashboard.html");
     */
    newDashboard: function(url, html) {
        var win = window.open(url, "_blank", "attributes={\"window\":\"dashboard\"}");
        html && win.document.write(html);
        win.PalmSystem.stageReady();
    },

    /*
     * Displays a banner notification. If specified, will send your 'response' object as data via the 'palmsystem' DOM event.
     * If no 'icon' filename is specified, will use a small version of your application icon.
     * @param {String} message
     * @param {Object} response
     * @param {String} icon
     * @param {String} soundClass class of the sound; supported classes are: "ringtones", "alerts", "alarm", "calendar", "notification"
     * @param {String} soundFile partial or full path to the sound file
     * @param {String} soundDurationMs of sound in ms
     * Example:
     *        navigator.notification.showBanner('test message');
     */
    showBanner: function(message, response, icon, soundClass, soundFile, soundDurationMs) {
        response = response || {
            banner: true
        };
        PalmSystem.addBannerMessage(message, JSON.stringify(response), icon, soundClass, soundFile, soundDurationMs);
    },

    /**
     * Remove a banner from the banner area. The category parameter defaults to 'banner'. Will not remove
     * messages that are already displayed.
     * @param {String} category
            Value defined by the application and usually same one used in {@link showBanner}.
            It is used if you have more than one kind of banner message.
     */
    removeBannerMessage: function(category) {
        var bannerKey = category || 'banner';
        var bannerId = this.banners.get(bannerKey);
        if (bannerId) {
            try {
                PalmSystem.removeBannerMessage(bannerId);
            } catch(removeBannerException) {
                window.debug.error(removeBannerException.toString());
            }
        }
    },

    /*
     * Remove all pending banner messages from the banner area. Will not remove messages that are already displayed.
     */
    clearBannerMessage: function() {
        PalmSystem.clearBannerMessage();
    },

    /*
     * This function vibrates the device
     * @param {number} duration The duration in ms to vibrate for.
     * @param {number} intensity The intensity of the vibration
     */
    vibrate_private: function(duration, intensity) {
        //the intensity for palm is inverted; 0=high intensity, 100=low intensity
        //this is opposite from our api, so we invert
        if (isNaN(intensity) || intensity > 100 || intensity <= 0)
            intensity = 0;
        else
            intensity = 100 - intensity;

        // if the app id does not have the namespace "com.palm.", an error will be thrown here
        //this.vibhandle = new Mojo.Service.Request("palm://com.palm.vibrate", {
        this.vibhandle = navigator.service.Request("palm://com.palm.vibrate", {
            method: 'vibrate',
            parameters: {
                'period': intensity,
                'duration': duration
            }
        },
        false);
    },

    vibrate: function(param) {
        PalmSystem.playSoundNotification('vibrate');
    },
    /*
     * Plays the specified sound
     * @param {String} soundClass class of the sound; supported classes are: "ringtones", "alerts", "alarm", "calendar", "notification"
     * @param {String} soundFile partial or full path to the sound file
     * @param {String} soundDurationMs of sound in ms
     */
    beep: function(param) {
        PalmSystem.playSoundNotification('alerts');
    },

    getRootWindow: function() {
        var w = window.opener || window.rootWindow || window.top || window;
        if(!w.setTimeout) { // use this window as the root if we don't have access to the real root.
            w = window;
        }
        return w;
    },

    open: function(inOpener, inUrl, inName, inAttributes, inWindowInfo) {
        var url = inUrl;
        var a = inAttributes && JSON.stringify(inAttributes);
        a = "attributes=" + a;
        var i = inWindowInfo ? inWindowInfo + ", " : "";
        return inOpener.open(url, inName, i + a);
    },

    openWindow: function(inUrl, inName, inParams, inAttributes, inWindowInfo) {
        //var attributes = inAttributes || {};
        //attributes.window = attributes.window || "card";
        // NOTE: make the root window open all windows.
        return this.open(this.getRootWindow(), inUrl, inName || "", inAttributes, inWindowInfo);
    },

    alert: function(message,callback,title,buttonName) {
        var inAttributes = {};
        //inAttributes.window = "card"; // create card
        inAttributes.window = "popupalert"; // create popup
        //inAttributes.window="dashboard"; // create dashboard
        var html='<html><head><script>setTimeout(function(f){var el=window.document.getElementById("b1");console.error(el);el.addEventListener("click",function(f){window.close();},false);},500);</script></head><body>'+message+'<br/><button id="b1">'+buttonName+'</button></body></html>';
        var inName="PopupAlert";
        var inUrl="";
        var inParams={};
        var inHeight=120;
        var w = this.openWindow(inUrl, inName, inParams, inAttributes, "height=" + (inHeight || 200));
        w.document.write(html);
        w.PalmSystem.stageReady();
    }
};
