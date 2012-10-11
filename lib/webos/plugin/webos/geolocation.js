var service=require('cordova/plugin/webos/service');

module.exports = {

getLocation: function(successCallback, errorCallback, options) {
    console.error("webos plugin geolocation getlocation");
    var request=service.Request('palm://com.palm.location', {
        method: "getCurrentPosition",
        onSuccess: function(event) {
            var alias={};
            alias.lastPosition = {
                coords: {
                    latitude: event.latitude,
                    longitude: event.longitude,
                    altitude: (event.altitude >= 0 ? event.altitude: null),
                    speed: (event.velocity >= 0 ? event.velocity: null),
                    heading: (event.heading >= 0 ? event.heading: null),
                    accuracy: (event.horizAccuracy >= 0 ? event.horizAccuracy: null),
                    altitudeAccuracy: (event.vertAccuracy >= 0 ? event.vertAccuracy: null)
                },
                timestamp: new Date().getTime()
            };

            successCallback(alias.lastPosition);
        },
        onFailure: function() {
            errorCallback();
        }
    });

}

};

