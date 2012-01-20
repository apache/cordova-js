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
        }
    }
};
