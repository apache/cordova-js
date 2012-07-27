var CompassError = require('cordova/plugin/CompassError'),
    callback = null, ready = false;

module.exports = {
    getHeading: function(successCallback, errorCallback) {
        if (window.DeviceOrientationEvent !== undefined) {
            callback = function (orientation) {
                var heading = 360 - orientation.alpha;
                if (ready) {
                    successCallback({
                        magneticHeading: heading,
                        trueHeading: heading,
                        headingAccuracy: 0,
                        timestamp: orientation.timeStamp
                    });
                    window.removeEventListener("deviceorientation", callback);
                }
                ready = true;
            };
            ready = false; // workaround invalid first event value returned by WRT
            window.addEventListener("deviceorientation", callback);
        }
        else {
            errorCallback(CompassError.COMPASS_NOT_SUPPORTED);
        }
    }
};
