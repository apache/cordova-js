module.exports = {
    id: "tizen",
    initialize: function() {},
    objects: {
        device: {
            path: "cordova/plugin/tizen/Device"
        },
        File: { // exists natively, override
            path: "cordova/plugin/File"
        },
        FileReader: { // exists natively, override
            path: "cordova/plugin/FileReader"
        },
        FileError: { //exists natively, override
            path: "cordova/plugin/FileError"
        }
    },
    merges: {
        MediaError: { // exists natively
            path: "cordova/plugin/tizen/MediaError"
        },
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/tizen/Device"
                },
                contacts: {
                    path: "cordova/plugin/tizen/contacts"
                },
               notification: {
                   path: "cordova/plugin/tizen/Notification"
               }
            }
        },
        Contact: {
            path: "cordova/plugin/tizen/Contact"
        }
    }
};
