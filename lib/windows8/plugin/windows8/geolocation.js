/*global Windows:true */

var Position = require('cordova/plugin/Position'),
    PositionError = require('cordova/plugin/PositionError');

module.exports = { // Merges with common


    getLocation:function(win, lose, args) {
        // options.enableHighAccuracy
        // options.maximumAge
        // options.timeout

        var geolocator = new Windows.Devices.Geolocation.Geolocator();
        if (options.enableHighAccuracy) {
            geolocator.desiredAccuracy = Windows.Devices.Geolocation.PositionAccuracy.high;
        }

        geolocator.getGeopositionAsync(options.maximumAge, options.timeout).done(
            function(geoposition) {
                // Win8 JS API coordinate Object
                win(geoposition.coordinate);
            }, function() {
                var e = {};

                switch (geolocator.locationStatus) {
                    case Windows.Devices.Geolocation.PositionStatus.ready:
                        // Location data is available
                        e.message = "Location is available.";
                        e.code = PositionError.TIMEOUT;
                        lose (e);
                        break;
                    case Windows.Devices.Geolocation.PositionStatus.initializing:
                        // This status indicates that a GPS is still acquiring a fix
                        e.message = "A GPS device is still initializing.";
                        e.code = PositionError.POSITION_UNAVAILABLE;
                        lose(e);
                        break;
                    case Windows.Devices.Geolocation.PositionStatus.noData:
                        // No location data is currently available
                        e.message = "Data from location services is currently unavailable.";
                        e.code = PositionError.POSITION_UNAVAILABLE;
                        lose(e);
                        break;
                    case Windows.Devices.Geolocation.PositionStatus.disabled:
                        // The app doesn't have permission to access location,
                        // either because location has been turned off.
                        e.message = "Your location is currently turned off. " +
                        "Change your settings through the Settings charm " +
                        " to turn it back on.";
                        e.code = PositionError.PERMISSION_DENIED;
                        lose(e);
                        break;
                    case Windows.Devices.Geolocation.PositionStatus.notInitialized:
                        // This status indicates that the app has not yet requested
                        // location data by calling GetGeolocationAsync() or
                        // registering an event handler for the positionChanged event.
                        e.message = "Location status is not initialized because " +
                        "the app has not requested location data.";
                        e.code = PositionError.POSITION_UNAVAILABLE;
                        lose(e);
                        break;
                    case Windows.Devices.Geolocation.PositionStatus.notAvailable:
                        // Location is not available on this version of Windows
                        e.message = "You do not have the required location services " +
                        "present on your system.";
                        e.code = PositionError.POSITION_UNAVAILABLE;
                        lose(e);
                        break;
                    default:
                        e.code = PositionError.TIMEOUT;
                        lose(e);
                        break;

                }
            }
        )
    },

    addWatch:function(win, lose, args) {
        // id
        // options
        // options.maximumAge
        // options.timeout
        // timers[]
        timers[id] = new Windows.Devices.Geolocation.Geolocator().getGeopositionAsync(options.maximumAge, options.timeout).done(
            new Geolocation().getCurrentPosition(win, lose, options)
        )
    }
    // clearWatch is not needed as in common code the timer is deleted
};