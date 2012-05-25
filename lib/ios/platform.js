module.exports = {
    id: "ios",
    initialize:function() {
        // iOS doesn't allow reassigning / overriding navigator.geolocation object.
        // So clobber its methods here instead :)
        var geo = require('cordova/plugin/geolocation');

        navigator.geolocation.getCurrentPosition = geo.getCurrentPosition;
        navigator.geolocation.watchPosition = geo.watchPosition;
        navigator.geolocation.clearWatch = geo.clearWatch;
    },
    objects: {
        File: { // exists natively, override
            path: "cordova/plugin/File"
        },
        MediaError: { // exists natively, override
            path: "cordova/plugin/MediaError"
        },
        device: {
            path: 'cordova/plugin/ios/device'
        },
        console: {
            path: 'cordova/plugin/ios/console'
        },
        CameraPopoverOptions: {
            path: 'cordova/plugin/ios/CameraPopoverOptions'
        }
    },
    merges:{
        Contact:{
            path: "cordova/plugin/ios/Contact"
        },
        Entry:{
            path: "cordova/plugin/ios/Entry"
        },
        FileReader:{
            path: "cordova/plugin/ios/FileReader"
        },
        navigator:{
            children:{
                notification:{
                    path:"cordova/plugin/ios/notification"
                },
                contacts:{
                    path:"cordova/plugin/ios/contacts"
                }
            }
        }
    }
};

// use the native logger
var logger = require("cordova/plugin/logger");
logger.useConsole(false);
