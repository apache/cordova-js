module.exports = {
    id: "playbook",
    initialize:function() {},
    objects: {
        device: {
            path: "cordova/plugin/playbook/device"
        }
    },
    merges: {
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/playbook/device"
                }
            }
        }
    }
};