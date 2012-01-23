var exec = require('phonegap/exec'),
    utils = require('phonegap/utils'),
    compass = {
    timers: {},
    /**
     * Asynchronously acquires the current heading.
     * @param {Function} successCallback The function to call when the heading
     * data is available
     * @param {Function} errorCallback The function to call when there is an error 
     * getting the heading data.
     * @param {CompassOptions} options The options for getting the heading data (not used).
     */
    getCurrentHeading: function (successCallback, errorCallback, options) {
        // successCallback required
        if (typeof successCallback !== "function") {
            console.log("Compass Error: successCallback is not a function");
            return;
        }

        // errorCallback optional
        if (errorCallback && (typeof errorCallback !== "function")) {
            console.log("Compass Error: errorCallback is not a function");
            return;
        }

        // Get heading
        exec(successCallback, errorCallback, "Compass", "getCurrentHeading", []);
    },

    /**
     * Asynchronously acquires the heading repeatedly at a given interval.
     * @param {Function} successCallback The function to call each time the heading
     * data is available
     * @param {Function} errorCallback The function to call when there is an error 
     * getting the heading data.
     * @param {HeadingOptions} options The options for getting the heading data
     * such as timeout and the frequency of the watch.
     */
    watchHeading: function (successCallback, errorCallback, options) {
        // Default interval (100 msec)
        var frequency = (options !== undefined && options.frequency !== undefined) ? options.frequency : 100;

        // successCallback required
        if (typeof successCallback !== "function") {
            console.log("Compass Error: successCallback is not a function");
            return;
        }

        // errorCallback optional
        if (errorCallback && (typeof errorCallback !== "function")) {
            console.log("Compass Error: errorCallback is not a function");
            return;
        }

        // Start watch timer to get headings
        var id = utils.createUUID();
        compass.timers[id] = window.setInterval(function() {
            exec(successCallback, errorCallback, "Compass", "getCurrentHeading", []);
        }, frequency);

        return id;
    },

    /**
     * Clears the specified heading watch.
     * @param {String} watchId The ID of the watch returned from #watchHeading.
     */
    clearWatch: function (id) {
        // Stop javascript timer & remove from timer list
        if (id && compass.timers[id]) {
            clearInterval(compass.timers[id]);
            delete compass.timers[id];
        }
    }
};

module.exports = compass;
