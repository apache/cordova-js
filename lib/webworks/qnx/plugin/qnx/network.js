var cordova = require('cordova'),
    connection = require('cordova/plugin/Connection');

module.exports = {
    getConnectionInfo: function (args, win, fail) {
        return { "status": cordova.callbackStatus.OK, "message": blackberry.connection.type};
    }
};
