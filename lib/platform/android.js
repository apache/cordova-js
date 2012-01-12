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
                JSCallback:{
                  path:"phonegap/plugin/android/callback"
                },
                JSCallbackPolling:{
                  path:"phonegap/plugin/android/callbackpolling"
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
        },
        device:{
          path: "phonegap/plugin/android/device"
        }
    }
};
