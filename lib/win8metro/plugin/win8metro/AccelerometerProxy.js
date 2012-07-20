var cordova = require('cordova'),
    Acceleration = require('cordova/plugin/Acceleration');

/* This is the actual implementation part that returns the result on Win8Metro
*/

module.exports = {
    onDataChanged:null,
    start:function(win,lose){

        var accel = Windows.Devices.Sensors.Accelerometer.getDefault();
        if(!accel) {
            lose("No accelerometer found");
        }
        else {
            var self = this;
            accel.reportInterval = Math.max(16,accel.minimumReportInterval);

            // store our bound function
            this.onDataChanged = function(e) {
                var a = e.reading;
                win(new Acceleration(a.accelerationX,a.accelerationY,a.accelerationZ));
            };
            accel.addEventListener("readingchanged",this.onDataChanged);
        }
    },
    stop:function(win,lose){
        console.log("Accelerometer.stop");
        var accel = Windows.Devices.Sensors.Accelerometer.getDefault();
        if(!accel) {
            lose("No accelerometer found");
        }
        else {
            accel.removeEventListener("readingchanged",this.onDataChanged);
            this.onDataChanged = null;
            accel.reportInterval = 0; // back to the default
            win();
        }
    }
};