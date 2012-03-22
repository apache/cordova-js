module.exports = {
    id: "wp7",
    initialize:function() {},
    objects: {
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/wp7/device"
                }
            }
        },
        device: {
            path: 'cordova/plugin/wp7/device'
        }
    }
};
