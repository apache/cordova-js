module.exports = {
    id: "bada",
    initialize: function() {},
    objects: {
        device: {
            path: 'cordova/plugin/bada/device'
        }
    },
    merges: {
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/bada/device"
                },
                camera: {
                    path: "cordova/plugin/bada/Camera"
                },
                capture: {
                    path: "cordova/plugin/bada/Capture"
                }
            }
        }
    }
};
