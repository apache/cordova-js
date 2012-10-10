var cordova = require('cordova'),
    exec = require('cordova/exec'),
    channel = cordova.require("cordova/channel");

module.exports = {
    id: "windows8",
    initialize:function() {
        var app = WinJS.Application;
                
        app.addEventListener("checkpoint", checkpointHandler);
        function checkpointHandler(eventArgs) {
            cordova.fireDocumentEvent('pause');
        };

        Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", resumingHandler, false);
        function resumingHandler() {
            cordova.fireDocumentEvent('resume');
        }

        app.start();
    },
    objects: {
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/windows8/device",
                    children: {
                        capture: {
                            path: "cordova/plugin/capture"
                        }
                    }
                },
                console: {
                    path: "cordova/plugin/windows8/console"
                }
            }
        },
        FileReader: {
            path: 'cordova/plugin/FileReader'
        },
        File: {
            path: 'cordova/plugin/File'
        }
    },
    merges: {
        navigator: {
            children: {
                geolocation: {
                    path: 'cordova/plugin/windows8/geolocation'
                }
            }
        }
    }
};
