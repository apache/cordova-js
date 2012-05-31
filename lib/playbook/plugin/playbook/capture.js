var cordova = require('cordova');

function capture(action, win, fail) {
    var onCaptured = blackberry.events.registerEventHandler("onCaptured", function (path) {
            var file = blackberry.io.file.getFileProperties(path);
            win([{
                fullPath: path,
                lastModifiedDate: file.dateModified,
                name: path.replace(file.directory + "/", ""),
                size: file.size,
                type: file.fileExtension
            }]);
        }),
        onCameraClosed = blackberry.events.registerEventHandler("onCameraClosed", function () {}),
        onError = blackberry.events.registerEventHandler("onError", fail),
        request = new blackberry.transport.RemoteFunctionCall('blackberry/media/camera/' + action);

    request.addParam("onCaptured", onCaptured);
    request.addParam("onCameraClosed", onCameraClosed);
    request.addParam("onError", onError);

    //HACK: this is a sync call due to:
    //https://github.com/blackberry/WebWorks-TabletOS/issues/51
    request.makeSyncCall();
}

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
        if (args[0].limit > 0) {
            capture("takePicture", win, fail);
        }
        else {
            win([]);
        }

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },
    captureVideo: function (args, win, fail) {
        if (args[0].limit > 0) {
            capture("takeVideo", win, fail);
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
