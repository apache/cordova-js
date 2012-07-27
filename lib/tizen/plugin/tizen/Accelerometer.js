var callback = null;

module.exports = {
    start: function (successCallback, errorCallback) {
        window.removeEventListener("devicemotion", callback);
        callback = function (motion) {
            successCallback({
                x: motion.accelerationIncludingGravity.x,
                y: motion.accelerationIncludingGravity.y,
                z: motion.accelerationIncludingGravity.z,
                timestamp: motion.timeStamp
            });
        };
        window.addEventListener("devicemotion", callback);
    },
    stop: function (successCallback, errorCallback) {
        window.removeEventListener("devicemotion", callback);
    }
};