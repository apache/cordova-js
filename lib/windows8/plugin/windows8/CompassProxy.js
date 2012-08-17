/*global Windows:true */
var cordova = require('cordova'),
    CompassHeading = require('cordova/plugin/CompassHeading');


module.exports = {

    onReadingChanged:null,
    getHeading:function(win,lose) {
        var deviceCompass = Windows.Devices.Sensors.Compass.getDefault();
        if(!deviceCompass) {
            setTimeout(function(){lose("Compass not available");},0);
        }
        else {

            deviceCompass.reportInterval = Math.max(16,deviceCompass.minimumReportInterval);

            this.onReadingChanged = function(e) {
                var reading = e.reading;
                var heading = new CompassHeading(reading.headingMagneticNorth, reading.headingTrueNorth);
                win(heading);
            };
            deviceCompass.addEventListener("readingchanged",this.onReadingChanged);
        }

    },
    stopHeading:function(win,lose) {
        var deviceCompass = Windows.Devices.Sensors.Compass.getDefault();
        if(!deviceCompass) {
            setTimeout(function(){lose("Compass not available");},0);
        }
        else {

            deviceCompass.removeEventListener("readingchanged",this.onReadingChanged);
            this.onReadingChanged = null;
            deviceCompass.reportInterval = 0;
            win();
        }

    }
};