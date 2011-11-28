module.exports = {
    id: "android",
    initialize:function() {
    },
    objects: {
        PhoneGap: {
            path: "phonegap",
            children: {
                exec: {
                    path: "phonegap/exec/android"
                },
                shuttingDown:{
                  value:false
                },
                JSCallback:{
                  path:"phonegap/plugin/android/callback"
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
                    path: "phonegap/plugin/android/device"
                }
            }
        },
        Connection: {
            path: "phonegap/plugin/Connection"
        }
    }

};
