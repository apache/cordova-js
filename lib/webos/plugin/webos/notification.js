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

var isLegacy = ((navigator.userAgent.indexOf("webOS")>-1) || (navigator.userAgent.indexOf("hpwOS")>-1));
var legacyAlert = function(callback, args) {
    var modulemapper = require('cordova/modulemapper');
    var origOpen = modulemapper.getOriginalSymbol(window, 'open');
    var callbackName = "popupAlert" + new Date().getTime();
    window[callbackName] = function() {
        if(callback) {
            callback();
        }
        delete window[callbackName];
    };
    var html='<html><head><style>body {color:white;' + ((isLegacy && window.device.version.indexOf("3.")<0) ? "background-color: #000000;" : "") + '-webkit-user-select: none;} .notification-button {position:absolute;bottom:6px;left:15%;right:15%;font-size: 16px;text-align: center;white-space: nowrap;padding: 6px 18px;overflow: hidden;border-radius: 3px;border: 1px solid #707070;border: 1px solid rgba(15, 15, 15, 0.5);box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.2);color: white;background-color: rgba(160,160,160,0.35););background-size: contain;text-overflow: ellipsis;} .notification-button:active:hover {background-position: top;border-top: 1px solid rgba(15, 15, 15, 0.6);box-shadow: inset 0px 1px 0px rgba(0, 0, 0, 0.1);bottom:5px;background:rgba(160,160,160,0.2);}</style><script>setTimeout(function(){document.addEventListener("keydown", function(e){if(e.keyCode==27) {e.preventDefault(); window.onbeforeunload(); return true;}}, true);document.getElementById("b1").addEventListener("click",function(f){window.close();},false); window.onbeforeunload=function(){window.opener.' + callbackName + '();};},200);</script></head><body><h2>' + args[1] + '</h2>' + args[0] + '<br/><br/><div id="b1" class="notification-button">' + args[2] + '</div></body></html>';
    var child = origOpen(undefined, "PopupAlert", "height=150, attributes={\"window\":\"popupalert\"}");
    child.document.write(html);
    if(child.PalmSystem) {
        child.PalmSystem.stageReady();
    }
};

module.exports = {
    alert: function(onSuccess, onFailure, args) {
        if(isLegacy) {
            legacyAlert(onSuccess, args);
        } else {
            window.alert(args[0]);
            onSuccess();
        }
    },
    confirm: function(onSuccess, onFailure, args) {
        if(isLegacy) {
            console.error("Cordova navigator.notification.confirm not supported");
        } else {
            var result = window.confirm(args[0]);
            onSuccess(1+(!result));
        }
    },
    prompt: function(onSuccess, onFailure, args) {
        if(isLegacy) {
            console.error("Cordova navigator.notification.prompt not supported");
        } else {
            var result = window.prompt(args[0], args[3]);
            onSuccess({buttonIndex: ((result==undefined) ? 2 : 1), input1:result || ""});
        }
    },
    vibrate: function(onSuccess, onFailure, args) {
        if(window.PalmSystem && window.PalmSystem.identifier.split(" ")[0].indexOf("com.palm.app.")==0) {
            var service = require('cordova/plugin/webos/service');
            this.vibRequest = service.request("palm://com.palm.vibrate", {
                method: 'vibrate',
                parameters: {
                    period: 0,
                    duration: args[0]
                },
                onFailure: function(inError) {
                    PalmSystem.playSoundNotification('vibrate');
                }
            });
        } else if(window.PalmSystem) {
            PalmSystem.playSoundNotification('vibrate');
        }
    },
    beep: function(onSuccess, onFailure, args) {
        if(window.PalmSystem) {
            PalmSystem.playSoundNotification('alerts');
        }
    }
};
