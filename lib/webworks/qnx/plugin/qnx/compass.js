var cordova = require('cordova'),
    callback;

module.exports = {
    start: function (args, win, fail) {
        window.removeEventListener("deviceorientation", callback);
        callback = function (orientation) {
            var heading = 360 - orientation.alpha;
            win({
                magneticHeading: heading,
                trueHeading: heading,
                headingAccuracy: 0,
                timestamp: orientation.timeStamp
            });
        };

        window.addEventListener("deviceorientation", callback);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },
    stop: function (args, win, fail) {
        window.removeEventListener("deviceorientation", callback);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    }
}
