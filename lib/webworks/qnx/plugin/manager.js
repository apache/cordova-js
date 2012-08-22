var cordova = require('cordova'),
    plugins = {
        'NetworkStatus' : require('cordova/plugin/qnx/network'),
        'Accelerometer' : require('cordova/plugin/webworks/accelerometer'),
        'Device' : require('cordova/plugin/qnx/device'),
        'Logger' : require('cordova/plugin/webworks/logger'),
        'Notification' : require('cordova/plugin/webworks/notification'),
        'Media': require('cordova/plugin/webworks/media')
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
