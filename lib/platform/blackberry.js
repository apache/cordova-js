module.exports = {
    id: "blackberry",
    initialize:function() {},
    objects: {
        PhoneGap: {
            path: "phonegap"
        },
        phonegap: {
            PluginManager: {
                path: "phonegap/plugin/blackberry/PluginManager"
            },
            WebWorksPluginManager: {
                path: "phonegap/plugin/blackberry/WebWorksPluginManager"
            }
        },
        navigator: {
            path: "phonegap/plugin/navigator",
            children: {
                network: {
                    path: "phonegap/plugin/network"
                },
                notification: {
                    path: "phonegap/plugin/notification"
                },
                accelerometer: {
                    path: "phonegap/plugin/accelerometer"
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
