module.exports = {
    id: "ios",
    initialize:function() {
        // iOS doesn't allow reassigning / overriding navigator.geolocation object.
        // So clobber its methods here instead :)
        var geo = require('cordova/plugin/geolocation');
        
        navigator.geolocation.getCurrentPosition = geo.getCurrentPosition;
        navigator.geolocation.watchPosition = geo.watchPosition;
        navigator.geolocation.clearWatch = geo.clearWatch;
        // Override Notification beep method with iOS-specific version.
        var notification = require('cordova/plugin/notification');
        notification.prototype.beep = require('cordova/plugin/ios/notification').beep;
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
        }
    },
    merges:{
        Entry:{
            path: "cordova/plugin/ios/Entry"
        },
        FileReader:{
            path: "cordova/plugin/ios/FileReader"
        }
    }
};
