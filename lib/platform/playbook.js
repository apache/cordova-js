module.exports = {
    id: "playbook",
    initialize:function() {},
    objects: {
        PhoneGap: {
            path: "phonegap",
            children: {
                exec: {
                    path: "phonegap/exec"
                }
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
                    path: "phonegap/plugin/playbook/device"
                }
            }
        },
        Connection: {
            path: "phonegap/plugin/Connection"
        },
        device: {
            path: "phonegap/plugin/playbook/device"
        }
    }
};
