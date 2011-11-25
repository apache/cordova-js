module.exports = {
    id: "ios",
    objects: {
        PhoneGap: {
            path: "phonegap",
            children: {
                exec: {
                    path: "phonegap/exec/ios"
                }
            }
        },
        navigator: {
            path: "phonegap/plugin/navigator",
            children: {
                notification: {
                    path: "phonegap/plugin/notification"
                },
                accelerometer: {
                    path: "phonegap/plugin/accelerometer"
                },
                camera: {
                    path: "phonegap/plugin/Camera"
                },
                network: {
                    children: {
                        connection: {
                            path: "phonegap/plugin/network"
                        }
                    }
                },
                device: {
                    path: "phonegap/plugin/ios/device"
                }
            }
        },
        Connection: {
            path: "phonegap/plugin/Connection"
        },
        Camera: {
            path: "phonegap/plugin/Camera"
        }
    }

};
