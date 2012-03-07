module.exports = {
    id: "ios",
    initialize:function() {
        // iOS doesn't allow reassigning / overriding navigator.geolocation object.
        // So clobber it here :)
        var geo = require('cordova/plugin/geolocation');
        
        navigator.geolocation.getCurrentPosition = geo.getCurrentPosition;
        navigator.geolocation.watchPosition = geo.watchPosition;
        navigator.geolocation.clearWatch = geo.clearWatch;
    },
    objects: {
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/ios/device"
                }
            }
        },
        device: {
          path: 'cordova/plugin/ios/device'
        },
        console: {
            path: 'cordova/plugin/ios/console'
        }
    }
};
