module.exports = {
    id: "blackberry",
    initialize:function() {
        var cordova = require('cordova'),
            exec = require('cordova/exec'),
            channel = require('cordova/channel'),
            blackberryManager = require('cordova/plugin/blackberry/manager'),
            app = require('cordova/plugin/blackberry/app');

        // TODO: is there a better way to do this? build-time
        // convention? how can we save the few bytes from
        // cordova/plugin/Entry + DirectoryEntry that will get
        // overridden?
        // Override File API's Entry + children's prototype methods
        var BB_Entry = require('cordova/plugin/blackberry/Entry'),
            BB_DirectoryEntry = require('cordova/plugin/blackberry/DirectoryEntry');

        Entry.prototype.remove = BB_Entry.remove;
        Entry.prototype.getParent = BB_Entry.getParent;

        DirectoryEntry.prototype.getDirectory = BB_DirectoryEntry.getDirectory;
        DirectoryEntry.prototype.getFile = BB_DirectoryEntry.getFile;

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
                if (this.handlers.length === 1) {
                    blackberry.system.event.onHardwareKey(
                            buttonMapping[event], fireEvent(event));
                }
            },
            onUnsubscribe : function() {
                // If we just detached the last handler, let native know we
                // no longer override the back button.
                if (this.handlers.length === 0) {
                    blackberry.system.event.onHardwareKey(
                            buttonMapping[event], null);
                }
            }}
        }

        // Inject listeners for buttons on the document.
        for (var button in buttonMapping) {
            if (buttonMapping.hasOwnProperty(button)) {
                cordova.addDocumentEventHandler(button, eventHandler(button));
            }
        }

        // Fires off necessary shite to pause/resume app
        var resume = function() {
            cordova.fireDocumentEvent('resume');
            blackberryManager.resume();
        };
        var pause = function() {
            cordova.fireDocumentEvent('pause');
            blackberryManager.pause();
        };

        /************************************************
         * Patch up the generic pause/resume listeners. *
         ************************************************/

        // Unsubscribe handler - turns off native backlight change
        // listener
        var onUnsubscribe = function() {
            if (channel.onResume.handlers.length === 0 && channel.onPause.handlers.length === 0) {
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
            console.log("Error deteching backlight on/off.");
        };

        // Override stock resume and pause listeners so we can trigger
        // some native methods during attach/remove
        channel.onResume = channel.create('onResume', {
            onSubscribe:function() {
                // If we just attached the first handler and there are
                // no pause handlers, start the backlight system
                // listener on the native side.
                if (channel.onResume.handlers.length === 1 && channel.onPause.handlers.length === 0) {
                    exec(backlightWin, backlightFail, "App", "detectBacklight", []);
                }
            },
            onUnsubscribe:onUnsubscribe
        });
        channel.onPause = channel.create('onPause', {
            onSubscribe:function() {
                // If we just attached the first handler and there are
                // no resume handlers, start the backlight system
                // listener on the native side.
                if (channel.onResume.handlers.length === 0 && channel.onPause.handlers.length === 1) {
                    exec(function(isOn) {
                        if (isOn === true) {
                            resume();
                        } else {
                            pause();
                        }
                    }, function(e) {
                        console.log("Error deteching backlight on/off.");
                    }, "App", "detectBacklight", []);
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
                device: {
                    path: "cordova/plugin/blackberry/device"
                },
                app: {
                    path: "cordova/plugin/blackberry/app"
                }
            }
        },
        device: {
            path: "cordova/plugin/blackberry/device"
        }
    }
};
