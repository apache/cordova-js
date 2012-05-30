var cordova = require('cordova'),
    plugins = {
        'Battery' : require('cordova/plugin/playbook/battery'),
        'Camera' : require('cordova/plugin/playbook/camera'),
        'Logger' : require('cordova/plugin/playbook/logger'),
        'Media' : require('cordova/plugin/playbook/media'),
        'Capture' : require('cordova/plugin/playbook/capture'),
        'Accelerometer' : require('cordova/plugin/playbook/accelerometer'),
        'NetworkStatus' : require('cordova/plugin/playbook/network'),
        'Notification' : require('cordova/plugin/playbook/notification')
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
