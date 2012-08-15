module.exports = {
    id: "blackberry",
    initialize:function() {
        var cordova = require('cordova'),
            exec = require('cordova/exec'),
            channel = require('cordova/channel'),
            manager = require('cordova/plugin/manager'),
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
            return { onSubscribe : function() {
                // If we just attached the first handler, let native know we
                // need to override the back button.
                if (this.numHandlers === 1) {
                    blackberry.system.event.onHardwareKey(
                            buttonMapping[event], fireEvent(event));
                }
            },
            onUnsubscribe : function() {
                // If we just detached the last handler, let native know we
                // no longer override the back button.
                if (this.numHandlers === 0) {
                    blackberry.system.event.onHardwareKey(
                            buttonMapping[event], null);
                }
            }};
        };

        // Inject listeners for buttons on the document.
        for (var button in buttonMapping) {
            if (buttonMapping.hasOwnProperty(button)) {
                cordova.addDocumentEventHandler(button, eventHandler(button));
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
        var onUnsubscribe = function() {
            if (channel.onResume.numHandlers === 0 && channel.onPause.numHandlers === 0) {
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
        channel.onResume = cordova.addDocumentEventHandler('resume', {
            onSubscribe:function() {
                // If we just attached the first handler and there are
                // no pause handlers, start the backlight system
                // listener on the native side.
                if (channel.onResume.numHandlers === 1 && channel.onPause.numHandlers === 0) {
                    exec(backlightWin, backlightFail, "App", "detectBacklight", []);
                }
            },
            onUnsubscribe:onUnsubscribe
        });
        channel.onPause = cordova.addDocumentEventHandler('pause', {
            onSubscribe:function() {
                // If we just attached the first handler and there are
                // no resume handlers, start the backlight system
                // listener on the native side.
                if (channel.onResume.numHandlers === 0 && channel.onPause.numHandlers === 1) {
                    exec(backlightWin, backlightFail, "App", "detectBacklight", []);
                }
            },
            onUnsubscribe:onUnsubscribe
        });

        // Fire resume event when application brought to foreground.
        blackberry.app.event.onForeground(resume);

        // Fire pause event when application sent to background.
        blackberry.app.event.onBackground(pause);

        // Trap BlackBerry WebWorks exit. Allow plugins to clean up before exiting.
        blackberry.app.event.onExit(app.exitApp);
    },
    objects: {
        navigator: {
            children: {
                app: {
                    path: "cordova/plugin/java/app"
                }
            }
        },
        File: { // exists natively on BlackBerry OS 7, override
            path: "cordova/plugin/File"
        }
    },
    merges: {
        navigator: {
            children: {
                contacts: {
                    path: 'cordova/plugin/java/contacts'
                },
                notification: {
                    path: 'cordova/plugin/java/notification'
                }
            }
        },
        Contact: {
            path: 'cordova/plugin/java/Contact'
        },
        DirectoryEntry: {
            path: 'cordova/plugin/java/DirectoryEntry'
        },
        Entry: {
            path: 'cordova/plugin/java/Entry'
        },
        MediaError: { // Exists natively on BB OS 6+, merge in Cordova specifics
            path: 'cordova/plugin/java/MediaError'
        }
    }
};
