var cordova = require('cordova');

module.exports = {
    log: function (args, win, fail) {
        console.log(args);
        return {"status" : cordova.callbackStatus.OK,
                "message" : 'Message logged to console: ' + args};
    }
};
