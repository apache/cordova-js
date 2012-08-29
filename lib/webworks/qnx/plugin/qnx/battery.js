var cordova = require('cordova'),
    handler;


module.exports = {
    start: function (args, win, fail) {
        handler = win;
        blackberry.event.addEventListener("batterystatus", handler);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },

    stop: function (args, win, fail) {
        blackberry.event.removeEventListener("batterystatus", handler);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    }
};
