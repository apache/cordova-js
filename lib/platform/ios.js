module.exports = {
    id: "ios",
    initialize:function() {

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
