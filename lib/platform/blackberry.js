module.exports = {
    id: "blackberry",
    initialize:function() {},
    objects: {
        PhoneGap: {
            path: "phonegap",
            children: {
                exec: {
                    path: "phonegap/exec/blackberry"
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
                network: {
                    children: {
                        connection: {
                            path: "phonegap/plugin/network"
                        }
                    }
                },
                device: {
                    path: "phonegap/plugin/blackberry/device"
                }
            }
        },
        Connection: {
            path: "phonegap/plugin/Connection"
        }
    }
};
