module.exports = {
    id: "playbook",
    initialize:function() {},
    objects: {
        navigator: {
            children: {
                device: {
                    path: "phonegap/plugin/playbook/device"
                }
            }
        },
        device: {
            path: "phonegap/plugin/playbook/device"
        }
    }
};
