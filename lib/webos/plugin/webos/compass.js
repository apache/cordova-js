var CompassHeading = require('cordova/plugin/CompassHeading'),
CompassError = require('cordova/plugin/CompassError');

module.exports={
    getHeading: function(win,lose) {
        // only TouchPad and Pre3 have a Compass/Gyro
        if (device.name!=="TouchPad" && device.name!=="Pr"+String.fromCharCode(275)+"3") {
            lose({code: CompassError.COMPASS_NOT_SUPPORTED});
        } else {
            console.error("webos plugin compass getheading");
            var that = this;
            this.onReadingChanged = function(e) {
                var heading = new CompassHeading(event.magHeading,event.trueHeading);
                document.removeEventListener("compass",that.onReadingChanged);
                win(heading);
            }
            document.addEventListener("compass", this.onReadingChanged);
        }
    }
}