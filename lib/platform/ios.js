module.exports = {
    id: "ios",
    initialize:function() {},
    objects: {
        navigator: {
            children: {
                device: {
                    path: "phonegap/plugin/ios/device"
                }
            }
        },
        device: {
          path: 'phonegap/plugin/ios/device'
        },
        console: {
            path: 'phonegap/plugin/ios/console'
        }
    }
};
