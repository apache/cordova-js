var Acceleration = require('cordova/plugin/Acceleration');

module.exports = {
    getCurrentAcceleration: function(successCallback, errorCallback, options) {
        var success = function(acceleration) {
            console.log("Accelermometer:getAcceleration:success");
            var accel = new Acceleration(acceleration.xAxis, acceleration.yAxis, acceleration.zAxis);
            successCallback(accel);
        };
        var error = function(err) {
            console.log("Accelermometer:getAcceleration:error");
            if (err.code == err.TYPE_MISMATCH_ERR) {
                console.log("TYPE MISMATCH ERROR");
            }

            errorCallback(err);
        };
        deviceapis.accelerometer.getCurrentAcceleration(success, error);
    },
    watchAcceleration: function(successCallback, errorCallback, options) {
        var success = function(acceleration) {
            console.log("accelerometer:watchAcceleration:success");
            var accel = new Acceleration(acceleration.xAxis, acceleration.yAxis, acceleration.zAxis);
            successCallback(accel);
        };
        var error = function(err) {
            console.log("accelerometer:watchAcceleration:error");
            errorCallback(err);
        };
        return deviceapis.accelerometer.watchAcceleration(success, error);
    },
    clearWatch: function(watchID) {
        deviceapis.accelerometer.clearWatch(watchID);
    }
};
