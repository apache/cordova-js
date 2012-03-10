module.exports = {
    id: "ios",
    initialize:function() {
        // iOS doesn't allow reassigning / overriding navigator.geolocation object.
        // So clobber its methods here instead :)
        var geo = require('cordova/plugin/geolocation');
        
        navigator.geolocation.getCurrentPosition = geo.getCurrentPosition;
        navigator.geolocation.watchPosition = geo.watchPosition;
        navigator.geolocation.clearWatch = geo.clearWatch;

        // Override Entry's toURL method with iOS platform-specific version.
        var Entry = require('cordova/plugin/Entry');
        Entry.prototype.toURL = require('cordova/plugin/ios/Entry').toURL;

        // Override FileReader's readAsText method with iOS-specific version.
        var FileReader = require('cordova/plugin/FileReader');
        FileReader.prototype.readAsText = require('cordova/plugin/ios/FileReader').readAsText;
    },
    objects: {
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/ios/device"
                }
            }
        },
        File: { // exists natively , override
            path: "cordova/plugin/File"
        },
        device: {
            path: 'cordova/plugin/ios/device'
        },
        console: {
            path: 'cordova/plugin/ios/console'
        }
    }
};
