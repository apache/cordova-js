module.exports = {
    id: "playbook",
    initialize:function() {},
    objects: {
        DirectoryReader:{
            path: 'cordova/plugin/playbook/DirectoryReader'
        },
        File:{
            path: 'cordova/plugin/playbook/File'
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
        resolveLocalFileSystemURI:{
            path: 'cordova/plugin/playbook/resolveLocalFileSystemURI'
        }
    },
    merges: {
        DirectoryEntry: {
            path: 'cordova/plugin/playbook/DirectoryEntry'
        },
        Entry: {
            path: 'cordova/plugin/playbook/Entry'
        },
        FileEntry:{
            path: 'cordova/plugin/playbook/FileEntry'
        }
    }
};
