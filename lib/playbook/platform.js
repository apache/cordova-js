module.exports = {
    id: "playbook",
    initialize:function() {},
    objects: {
        device: {
            path: "cordova/plugin/playbook/device"
        },
        DirectoryEntry: {
            path: 'cordova/plugin/playbook/DirectoryEntry'
        },
        File:{
            path: 'cordova/plugin/playbook/File'
        },
        FileEntry:{
            path: 'cordova/plugin/playbook/FileEntry'
        },
        FileReader:{
            path: 'cordova/plugin/playbook/FileReader'
        },
        FileWriter:{
            path: 'cordova/plugin/playbook/FileWriter'
        },
        requestFileSystem:{
            path: 'cordova/plugin/playbook/requestFileSystem'
        },
    },
    merges: {
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/playbook/device"
                }
            }
        },
        Entry: {
            path: 'cordova/plugin/playbook/Entry'
        }
    }
};
