var cordova = require('cordova'),
    callback;

module.exports = {
    start: function (args, win, fail) {
        window.removeEventListener("devicemotion", callback);
        callback = function (motion) {
            win({
                x: motion.accelerationIncludingGravity.x,
                y: motion.accelerationIncludingGravity.y,
                z: motion.accelerationIncludingGravity.z,
                timestamp: motion.timestamp
            });
        };
        window.addEventListener("devicemotion", callback);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },
    stop: function (args, win, fail) {
        window.removeEventListener("devicemotion", callback);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    }
};
