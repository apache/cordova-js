module.exports = {
    id: "blackberry",
    initialize:function() {
        // Override File API's Entry prototype methods
        var BB_Entry = require('phonegap/plugin/blackberry/Entry');
        Entry.prototype.remove = BB_Entry.remove;
        Entry.prototype.getParent = BB_Entry.getParent;
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
