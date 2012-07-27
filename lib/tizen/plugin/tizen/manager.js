var cordova = require('cordova');

module.exports = {
    exec: function (successCallback, errorCallback, clazz, action, args) {
        var plugin = require('cordova/plugin/tizen/' + clazz);

        if (plugin && typeof plugin[action] === 'function') {
            var result = plugin[action](successCallback, errorCallback, args);
            return result || {status: cordova.callbackStatus.NO_RESULT};
        }

        return {"status" : cordova.callbackStatus.CLASS_NOT_FOUND_EXCEPTION, "message" : "Function " + clazz + "::" + action + " cannot be found"};
    },
    resume: function () {},
    pause: function () {},
    destroy: function () {}
};
