module.exports = {
    id: "playbook",
    initialize:function() {},
    objects: {
        device: {
            path: "cordova/plugin/playbook/device"
        },
        requestFileSystem:{
            path: 'cordova/plugin/playbook/requestFileSystem'
        }
    },
    merges: {
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/playbook/device"
                }
            }
        },

        DirectoryEntry: {
            path: 'cordova/plugin/playbook/DirectoryEntry'
        },
        Entry: {
            path: 'cordova/plugin/playbook/Entry'
        }
    }
};
