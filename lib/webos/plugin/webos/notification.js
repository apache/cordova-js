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
    alert: function(onSuccess, onFailure, args) {
        window.alert(args[0]);
        onSuccess();
    },
    confirm: function(onSuccess, onFailure, args) {
        var result = window.confirm(args[0]);
        onSuccess(1+(!result));
    },
    prompt: function(onSuccess, onFailure, args) {
        var result = window.prompt(args[0], args[3]);
        onSuccess({buttonIndex: ((result==undefined) ? 2 : 1), input1:result || ""});
    },
    vibrate: function(onSuccess, onFailure, args) {
        if(window.PalmSystem && window.PalmSystem.identifier.split(" ")[0].indexOf("com.palm.app.")==0) {
            this.vibRequest = navigator.service.Request("palm://com.palm.vibrate", {
                method: 'vibrate',
                parameters: {
                    period: 0,
                    duration: args[0]
                },
                onFailure: function(inError) {
                    PalmSystem.playSoundNotification('vibrate');
                }
            }
        } else {
            PalmSystem.playSoundNotification('vibrate');
        }
    },
    beep: function(onSuccess, onFailure, args) {
        PalmSystem.playSoundNotification('alerts');
    }
        
    


    /* OLD WEBOS STUFF; BACKWARD COMPATIBILITY
    newDashboard: function(url, html) {
        var win = window.open(url, "_blank", "attributes={\"window\":\"dashboard\"}");
        html && win.document.write(html);
        win.PalmSystem.stageReady();
    },
    showBanner: function(message, response, icon, soundClass, soundFile, soundDurationMs) {
        response = response || {
            banner: true
        };
        PalmSystem.addBannerMessage(message, JSON.stringify(response), icon, soundClass, soundFile, soundDurationMs);
    },
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
    clearBannerMessage: function() {
        PalmSystem.clearBannerMessage();
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
    */
};
