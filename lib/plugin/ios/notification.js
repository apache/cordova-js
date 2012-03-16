var Media = require('cordova/Media');

module.exports = {
	beep:function(count) {
        new Media('beep.wav').play();
    }
}