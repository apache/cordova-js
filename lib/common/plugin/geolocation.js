var utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    PositionError = require('cordova/plugin/PositionError'),
    Position = require('cordova/plugin/Position');

var timers = {};   // list of timers in use

// Returns default params, overrides if provided with values
function parseParameters(options) {
    var opt = {
        maximumAge: 0,
        enableHighAccuracy: false,
        timeout: Infinity
    };

    if (options) {
        if (options.maximumAge !== undefined && !isNaN(options.maximumAge) && options.maximumAge > 0) {
            opt.maximumAge = options.maximumAge;
        }
        if (options.enableHighAccuracy !== undefined) {
            opt.enableHighAccuracy = options.enableHighAccuracy;
        }
        if (options.timeout !== undefined && !isNaN(options.timeout)) {
            if (options.timeout < 0) {
                opt.timeout = 0;
            } else {
                opt.timeout = options.timeout;
            }
        }
    }

    return opt;
}

var geolocation = {
    lastPosition:null, // reference to last known (cached) position returned
    /**
   * Asynchronously aquires the current position.
   *
   * @param {Function} successCallback    The function to call when the position data is available
   * @param {Function} errorCallback      The function to call when there is an error getting the heading position. (OPTIONAL)
   * @param {PositionOptions} options     The options for getting the position data. (OPTIONAL)
   */
    getCurrentPosition:function(successCallback, errorCallback, options) {
        if (arguments.length === 0) {
            throw new Error("getCurrentPosition must be called with at least one argument.");
        }
        options = parseParameters(options);

        // Timer var that will fire an error callback if no position is retrieved from native
        // before the "timeout" param provided expires
        var timeoutTimer = null;

        var win = function(p) {
            clearTimeout(timeoutTimer);
            if (!timeoutTimer) {
                // Timeout already happened, or native fired error callback for
                // this geo request.
                // Don't continue with success callback.
                return;
            }
            var pos = new Position(
                {
                    latitude:p.latitude,
                    longitude:p.longitude,
                    altitude:p.altitude,
                    accuracy:p.accuracy,
                    heading:p.heading,
                    velocity:p.velocity,
                    altitudeAccuracy:p.altitudeAccuracy
                },
                p.timestamp || new Date()
            );
            geolocation.lastPosition = pos;
            successCallback(pos);
        };
        var fail = function(e) {
            clearTimeout(timeoutTimer);
            timeoutTimer = null;
            var err = new PositionError(e.code, e.message);
            if (errorCallback) {
                errorCallback(err);
            }
        };

        // Check our cached position, if its timestamp difference with current time is less than the maximumAge, then just
        // fire the success callback with the cached position.
        if (geolocation.lastPosition && options.maximumAge && (((new Date()).getTime() - geolocation.lastPosition.timestamp.getTime()) <= options.maximumAge)) {
            successCallback(geolocation.lastPosition);
        // If the cached position check failed and the timeout was set to 0, error out with a TIMEOUT error object.
        } else if (options.timeout === 0) {
            fail({
                code:PositionError.TIMEOUT,
                message:"timeout value in PositionOptions set to 0 and no cached Position object available, or cached Position object's age exceed's provided PositionOptions' maximumAge parameter."
            });
        // Otherwise we have to call into native to retrieve a position.
        } else {
            if (options.timeout !== Infinity) {
                // If the timeout value was not set to Infinity (default), then
                // set up a timeout function that will fire the error callback 
                // if no successful position was retrieved before timeout expired.
                timeoutTimer = setTimeout(function() {
                    clearTimeout(timeoutTimer);
                    timeoutTimer = null;
                    fail({
                        code:PositionError.TIMEOUT,
                        message:"Position retrieval timed out."
                    });
                }, options.timeout);
            } else {
                // This is here so the check in the win function doesn't mess stuff up
                // may seem weird but this guarantees timeoutTimer is 
                // always truthy before we call into native
                timeoutTimer = true; 
            }
            exec(win, fail, "Geolocation", "getLocation", [options.enableHighAccuracy, options.timeout, options.maximumAge]); 
        }
    },
    /**
     * Asynchronously watches the geolocation for changes to geolocation.  When a change occurs,
     * the successCallback is called with the new location.
     *
     * @param {Function} successCallback    The function to call each time the location data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the location data. (OPTIONAL)
     * @param {PositionOptions} options     The options for getting the location data such as frequency. (OPTIONAL)
     * @return String                       The watch id that must be passed to #clearWatch to stop watching.
     */
    watchPosition:function(successCallback, errorCallback, options) {
        options = parseParameters(options);

        var id = utils.createUUID();
        timers[id] = window.setInterval(function() {
            geolocation.getCurrentPosition(successCallback, errorCallback, options);
        }, options.timeout);

        return id;
    },
    /**
     * Clears the specified heading watch.
     *
     * @param {String} id       The ID of the watch returned from #watchPosition
     */
    clearWatch:function(id) {
        if (id && timers[id] !== undefined) {
            window.clearInterval(timers[id]);
            delete timers[id];
        }
    }
};

module.exports = geolocation;
