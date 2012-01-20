module.exports = {
    id: "ios",
    initialize:function() {},
    objects: {
        navigator: {
            children: {
                device: {
                    path: "phonegap/plugin/wp7/device"
                }
            }
        },
        device: {
            path: 'phonegap/plugin/wp7/device'
        }
    }
};
