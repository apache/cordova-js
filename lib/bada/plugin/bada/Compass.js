var CompassHeading = require('cordova/plugin/CompassHeading');

module.exports = {
        getHeading: function(compassSuccess, compassError, compassOptions) {
            if(deviceapis.orientation === undefined) {
                console.log("navigator.compass.getHeading", "Operation not supported!");
                return -1;
            }
            var success = function(orientation) {
                var heading = 360 - orientation.alpha;
                var compassHeading = new CompassHeading(heading, heading, 0);
                compassSuccess(compassHeading);
            };
            var error = function(error) {
                compassError(error);
            };
            deviceapis.orientation.getCurrentOrientation(success, error);
        }
};
