var exec = require('cordova/exec');

var splashscreen = {
    hide:function() {
        exec(null, null, "SplashScreen", "hide", []);
    }
};

module.exports = splashscreen;