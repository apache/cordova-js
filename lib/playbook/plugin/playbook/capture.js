var cordova = require('cordova');

module.exports = {
    getSupportedAudioModes: function (args, win, fail) {
        return {"status": cordova.callbackStatus.OK, "message": []};
    },
    getSupportedImageModes: function (args, win, fail) {
        return {"status": cordova.callbackStatus.OK, "message": []};
    },
    getSupportedVideoModes: function (args, win, fail) {
        return {"status": cordova.callbackStatus.OK, "message": []};
    },
    captureImage: function (args, win, fail) {
        var limit = args[0].limit;

        if (limit > 0) {
            blackberry.media.camera.takePicture(win, fail, fail);
        }
        else {
            win([]);
        }

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },
    captureVideo: function (args, win, fail) {
        var limit = args[0];

        if (limit > 0) {
            blackberry.media.camera.takeVideo(win, fail, fail);
        }
        else {
            win([]);
        }
        
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },
    captureAudio: function (args, win, fail) {
        return {"status": cordova.callbackStatus.INVALID_ACTION, "message": "captureAudio is not currently supported"};
    }
};
