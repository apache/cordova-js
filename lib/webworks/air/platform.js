module.exports = {
    id: "playbook",
    initialize:function() {},
    objects: {
        DirectoryReader:{
            path: 'cordova/plugin/air/DirectoryReader'
        },
        File:{
            path: 'cordova/plugin/air/File'
        },
        FileReader:{
            path: 'cordova/plugin/air/FileReader'
        },
        FileWriter:{
            path: 'cordova/plugin/air/FileWriter'
        },
        requestFileSystem:{
            path: 'cordova/plugin/air/requestFileSystem'
        },
        resolveLocalFileSystemURI:{
            path: 'cordova/plugin/air/resolveLocalFileSystemURI'
        }
    },
    merges: {
        DirectoryEntry: {
            path: 'cordova/plugin/air/DirectoryEntry'
        },
        Entry: {
            path: 'cordova/plugin/air/Entry'
        },
        FileEntry:{
            path: 'cordova/plugin/air/FileEntry'
        }
    }
};
