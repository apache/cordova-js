module.exports = {
    id: "playbook",
    initialize:function() {},
    objects: {
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/playbook/device"
                }
            }
        },
        device: {
            path: "cordova/plugin/playbook/device"
        }
    }
};
