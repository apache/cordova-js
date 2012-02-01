module.exports = {
    id: "blackberry",
    initialize:function() {
        var phonegap = require('phonegap'),
            exec = require('phonegap/exec'),
            channel = require('phonegap/channel'),
            blackberryManager = require('phonegap/plugin/blackberry/manager/blackberry');

        // Override File API's Entry + children's prototype methods
        var BB_Entry = require('phonegap/plugin/blackberry/Entry'),
            BB_DirectoryEntry = require('phonegap/plugin/blackberry/DirectoryEntry');

        Entry.prototype.remove = BB_Entry.remove;
        Entry.prototype.getParent = BB_Entry.getParent;

        DirectoryEntry.prototype.getDirectory = BB_DirectoryEntry.getDirectory;
        DirectoryEntry.prototype.getFile = BB_DirectoryEntry.getFile;

        // Listeners for hardware buttons
        phonegap.addDocumentEventHandler('backbutton');
        phonegap.addDocumentEventHandler('menubutton');
        phonegap.addDocumentEventHandler('searchbutton');

        // Fires off necessary shite to pause/resume app
        var resume = function() {
            phonegap.fireDocumentEvent('resume');
            blackberryManager.resume();
        };
        var pause = function() {
            phonegap.fireDocumentEvent('pause');
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
    },
    objects: {
        navigator: {
            children: {
                device: {
                    path: "phonegap/plugin/blackberry/device"
                }
            }
        },
        device: {
            path: "phonegap/plugin/blackberry/device"
        }
    }
};
