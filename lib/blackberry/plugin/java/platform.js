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
    id: "blackberry",
    initialize:function() {
        var cordova = require('cordova'),
            exec = require('cordova/exec'),
            channel = require('cordova/channel'),
            platform = require('cordova/platform'),
            manager = require('cordova/plugin/' + platform.runtime() + '/manager'),
            app = require('cordova/plugin/java/app');

        // BB OS 5 does not define window.console.
        if (typeof window.console === 'undefined') {
            window.console = {};
        }

        // Override console.log with native logging ability.
        // BB OS 7 devices define console.log for use with web inspector
        // debugging. If console.log is already defined, invoke it in addition
        // to native logging.
        var origLog = window.console.log;
        window.console.log = function(msg) {
            if (typeof origLog === 'function') {
                origLog.call(window.console, msg);
            }
            org.apache.cordova.Logger.log(''+msg);
        };

        // Mapping of button events to BlackBerry key identifier.
        var buttonMapping = {
            'backbutton'         : blackberry.system.event.KEY_BACK,
            'conveniencebutton1' : blackberry.system.event.KEY_CONVENIENCE_1,
            'conveniencebutton2' : blackberry.system.event.KEY_CONVENIENCE_2,
            'endcallbutton'      : blackberry.system.event.KEY_ENDCALL,
            'menubutton'         : blackberry.system.event.KEY_MENU,
            'startcallbutton'    : blackberry.system.event.KEY_STARTCALL,
            'volumedownbutton'   : blackberry.system.event.KEY_VOLUMEDOWN,
            'volumeupbutton'     : blackberry.system.event.KEY_VOLUMEUP
        };

        // Generates a function which fires the specified event.
        var fireEvent = function(event) {
            return function() {
                cordova.fireDocumentEvent(event, null);
            };
        };

        var eventHandler = function(event) {
            return function() {
                // If we just attached the first handler, let native know we
                // need to override the hardware button.
                if (this.numHandlers) {
                    blackberry.system.event.onHardwareKey(
                            buttonMapping[event], fireEvent(event));
                }
                // If we just detached the last handler, let native know we
                // no longer override the hardware button.
                else {
                    blackberry.system.event.onHardwareKey(
                            buttonMapping[event], null);
                }
            };
        };

        // Inject listeners for buttons on the document.
        for (var button in buttonMapping) {
            if (buttonMapping.hasOwnProperty(button)) {
                var buttonChannel = cordova.addDocumentEventHandler(button);
                buttonChannel.onHasSubscribersChange = eventHandler(button);
            }
        }

        // Fires off necessary code to pause/resume app
        var resume = function() {
            cordova.fireDocumentEvent('resume');
            manager.resume();
        };
        var pause = function() {
            cordova.fireDocumentEvent('pause');
            manager.pause();
        };

        /************************************************
         * Patch up the generic pause/resume listeners. *
         ************************************************/

        // Unsubscribe handler - turns off native backlight change
        // listener
        var onHasSubscribersChange = function() {
            // If we just attached the first handler and there are
            // no pause handlers, start the backlight system
            // listener on the native side.
            if (this.numHandlers && (channel.onResume.numHandlers + channel.onPause.numHandlers === 1)) {
                exec(backlightWin, backlightFail, "App", "detectBacklight", []);
            } else if (channel.onResume.numHandlers === 0 && channel.onPause.numHandlers === 0) {
                exec(null, null, 'App', 'ignoreBacklight', []);
            }
        };

        // Native backlight detection win/fail callbacks
        var backlightWin = function(isOn) {
            if (isOn === true) {
                resume();
            } else {
                pause();
            }
        };
        var backlightFail = function(e) {
            console.log("Error detecting backlight on/off.");
        };

        // Override stock resume and pause listeners so we can trigger
        // some native methods during attach/remove
        channel.onResume = cordova.addDocumentEventHandler('resume');
        channel.onResume.onHasSubscribersChange = onHasSubscribersChange;
        channel.onPause = cordova.addDocumentEventHandler('pause');
        channel.onPause.onHasSubscribersChange = onHasSubscribersChange;

        // Fire resume event when application brought to foreground.
        blackberry.app.event.onForeground(resume);

        // Fire pause event when application sent to background.
        blackberry.app.event.onBackground(pause);

        // Trap BlackBerry WebWorks exit. Allow plugins to clean up before exiting.
        blackberry.app.event.onExit(app.exitApp);
    },
    clobbers: {
        navigator: {
            children: {
                app: {
                    path: "cordova/plugin/java/app"
                }
            }
        }
    }
};
