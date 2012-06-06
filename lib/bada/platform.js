module.exports = {
    id: "bada",
    initialize: function() {},
    objects: {
        device: {
            path: 'cordova/plugin/bada/device'
        },
        navigator: {
            children: {
                accelerometer: {
                    path: "cordova/plugin/bada/Accelerometer"
                },
                notification: {
                    path: "cordova/plugin/bada/Notification"
                }
            }
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
