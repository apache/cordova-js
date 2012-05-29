var cordova = require('cordova');

module.exports = {
    takePicture: function (args, win, fail) {
        blackberry.media.camera.takePicture(win, fail, fail);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    }
};
