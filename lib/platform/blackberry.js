module.exports = {
    id: "blackberry",
    initialize:function() {
        // Override File API's Entry + children's prototype methods
        var BB_Entry = require('phonegap/plugin/blackberry/Entry'),
            BB_DirectoryEntry = require('phonegap/plugin/blackberry/DirectoryEntry');

        Entry.prototype.remove = BB_Entry.remove;
        Entry.prototype.getParent = BB_Entry.getParent;

        DirectoryEntry.prototype.getDirectory = BB_DirectoryEntry.getDirectory;
        DirectoryEntry.prototype.getFile = BB_DirectoryEntry.getFile;
    },
    objects: {
        navigator: {
            children: {
                device: {
                    path: "phonegap/plugin/blackberry/device"
                }
            }
        },
        device: {
            path: "phonegap/plugin/blackberry/device"
        }
    }
};
