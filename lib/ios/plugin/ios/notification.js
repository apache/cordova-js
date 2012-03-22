var Media = require('cordova/plugin/Media');

module.exports = {
    beep:function(count) {
        (new Media('beep.wav')).play();
    }
}
