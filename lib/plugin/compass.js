var exec = require('cordova/exec'),
    utils = require('cordova/utils'),
    timers = {},
    compass = {
        /**
         * Asynchronously acquires the current heading.
         * @param {Function} successCallback The function to call when the heading
         * data is available
         * @param {Function} errorCallback The function to call when there is an error 
         * getting the heading data.
         * @param {CompassOptions} options The options for getting the heading data (not used).
         */
        getCurrentHeading:function(successCallback, errorCallback, options) {
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

            var win = function(result) {
                if (result.timestamp) {
                    var timestamp = new Date(result.timestamp);
                    result.timestamp = timestamp;
                }
                successCallback(result);   
            };
            
            // Get heading
            exec(win, errorCallback, "Compass", "getHeading", []);
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
        watchHeading:function(successCallback, errorCallback, options) {
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
            var win = function(result) {
                if (result.timestamp) {
                    var timestamp = new Date(result.timestamp);
                    result.timestamp = timestamp;
                }
                successCallback(result);   
            };
            timers[id] = setInterval(function() {
                 exec(win, errorCallback, "Compass", "getHeading", []);
            }, frequency);

            return id;
        },

        /**
         * Clears the specified heading watch.
         * @param {String} watchId The ID of the watch returned from #watchHeading.
         */
        clearWatch:function(id) {
            // Stop javascript timer & remove from timer list
            if (id && timers[id]) {
              clearInterval(timers[id]);
              delete timers[id];
            }
        }
    };

module.exports = compass;
