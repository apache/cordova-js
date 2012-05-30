var cordova = require('cordova');

module.exports = {
    takePicture: function (args, win, fail) {
        var onCaptured = blackberry.events.registerEventHandler("onCaptured", win),
            onCameraClosed = blackberry.events.registerEventHandler("onCameraClosed", function () {}),
            onError = blackberry.events.registerEventHandler("onError", fail),
            request = new blackberry.transport.RemoteFunctionCall('blackberry/media/camera/takePicture');

        request.addParam("onCaptured", onCaptured);
        request.addParam("onCameraClosed", onCameraClosed);
        request.addParam("onError", onError);

        //HACK: this is a sync call due to: 
        //https://github.com/blackberry/WebWorks-TabletOS/issues/51
        request.makeSyncCall();
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    }
};
