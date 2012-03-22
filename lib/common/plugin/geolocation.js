var utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    PositionError = require('cordova/plugin/PositionError'),
    Position = require('cordova/plugin/Position');

var timers = {};   // list of timers in use

// Returns default params, overrides if provided with values
function parseParameters(options) {
    var opt = {
        maximumAge: 10000,
        enableHighAccuracy: false,
        timeout: 10000
    };

    if (options) {
        if (options.maximumAge !== undefined) {
            opt.maximumAge = options.maximumAge;
        }
        if (options.enableHighAccuracy !== undefined) {
            opt.enableHighAccuracy = options.enableHighAccuracy;
        }
        if (options.timeout !== undefined) {
            opt.timeout = options.timeout;
        }
    }

    return opt;
}

var geolocation = {
    /**
   * Asynchronously aquires the current position.
   *
   * @param {Function} successCallback    The function to call when the position data is available
   * @param {Function} errorCallback      The function to call when there is an error getting the heading position. (OPTIONAL)
   * @param {PositionOptions} options     The options for getting the position data. (OPTIONAL)
   */
    getCurrentPosition:function(successCallback, errorCallback, options) {
        options = parseParameters(options);

        var win = function(p) {
            successCallback(new Position(
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
            ));
        };
        var fail = function(e) {
            errorCallback(new PositionError(e.code, e.message));
        };

        exec(win, fail, "Geolocation", "getLocation", [options.enableHighAccuracy, options.timeout, options.maximumAge]); 
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
