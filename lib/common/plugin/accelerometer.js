/**
 * This class provides access to device accelerometer data.
 * @constructor
 */
var utils = require("cordova/utils"),
    exec = require("cordova/exec"),


// Keeps reference to watchAcceleration calls.
var timers = {};

var accelerometer = {
    /**
     * Asynchronously aquires the current acceleration.
     *
     * @param {Function} successCallback    The function to call when the acceleration data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the acceleration data. (OPTIONAL)
     * @param {AccelerationOptions} options The options for getting the accelerometer data such as timeout. (OPTIONAL)
     */
    getCurrentAcceleration: function(successCallback, errorCallback, options) {

        // successCallback required
        if (typeof successCallback !== "function") {
            throw "getCurrentAcceleration must be called with at least a success callback function as first parameter.";
        }

        // Get acceleration
        exec(successCallback, errorCallback, "Accelerometer", "getAcceleration", []);
    },

    /**
     * Asynchronously aquires the acceleration repeatedly at a given interval.
     *
     * @param {Function} successCallback    The function to call each time the acceleration data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the acceleration data. (OPTIONAL)
     * @param {AccelerationOptions} options The options for getting the accelerometer data such as timeout. (OPTIONAL)
     * @return String                       The watch id that must be passed to #clearWatch to stop watching.
     */
    watchAcceleration: function(successCallback, errorCallback, options) {

        // Default interval (10 sec)
        var frequency = (options && options.frequency && typeof options.frequency == 'number') ? options.frequency : 10000;

        // successCallback required
        if (typeof successCallback !== "function") {
            throw "watchAcceleration must be called with at least a success callback function as first parameter.";
        }

        // Keep reference to watch id
        var id = utils.createUUID();
        timers[id] = true;

        exec(successCallback, errorCallback, "Accelerometer", "addWatch", [id, frequency]);

        return id;
    },

    /**
     * Clears the specified accelerometer watch.
     *
     * @param {String} id       The id of the watch returned from #watchAcceleration.
     */
    clearWatch: function(id) {
        // Stop javascript timer & remove from timer list
        if (id && timers[id]) {
            delete timers[id];
            exec(null, null, "Accelerometer", "clearWatch", [id]);
        }
    }
};

module.exports = accelerometer;
