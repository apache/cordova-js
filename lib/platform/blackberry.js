module.exports = {
    id: "blackberry",
    initialize:function() {
        // Override File API's Entry's `remove` method
        Entry.prototype.remove = require('phonegap/plugin/blackberry/Entry').remove;
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
