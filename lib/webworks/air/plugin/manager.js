var cordova = require('cordova'),
    plugins = {
        'Device' : require('cordova/plugin/air/device'),
        'Battery' : require('cordova/plugin/air/battery'),
        'Camera' : require('cordova/plugin/air/camera'),
        'Logger' : require('cordova/plugin/webworks/logger'),
        'Media' : require('cordova/plugin/webworks/media'),
        'Capture' : require('cordova/plugin/air/capture'),
        'Accelerometer' : require('cordova/plugin/webworks/accelerometer'),
        'NetworkStatus' : require('cordova/plugin/air/network'),
        'Notification' : require('cordova/plugin/webworks/notification'),
        'FileTransfer' : require('cordova/plugin/air/FileTransfer')
    };

module.exports = {
    exec: function (win, fail, clazz, action, args) {
        var result = {"status" : cordova.callbackStatus.CLASS_NOT_FOUND_EXCEPTION, "message" : "Class " + clazz + " cannot be found"};

        if (plugins[clazz]) {
            if (plugins[clazz][action]) {
                result = plugins[clazz][action](args, win, fail);
            }
            else {
                result = { "status" : cordova.callbackStatus.INVALID_ACTION, "message" : "Action not found: " + action };
            }
        }

        return result;
    },
    resume: function () {},
    pause: function () {},
    destroy: function () {}
};
