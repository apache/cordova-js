module.exports = {
    startVideoCapture: function(success, fail, options) {
        var camera = navigator.camera._mainCamera;
        camera.startVideoCapture(success, fail, options);
    },
    stopVideoCapture: function() {
        navigator.camera._mainCamera.stopVideoCapture();
    },
    captureImage2: function(success, fail, options) {
        try {
            navigator.camera._mainCamera.captureImage(success, fail, options);
        } catch(exp) {
            alert("Exception :[" + exp.code + "] " + exp.message);
        }
    },
    captureAudio: function() {
        console.log("navigator.capture.captureAudio unsupported!");
    },
    captureImage: function(success, fail, options) {
        var dataList = [];
        dataList[0] = "type:camera";

        var appcontrolobject = Osp.App.AppManager.findAppControl("osp.appcontrol.provider.camera", "osp.appcontrol.operation.capture");

        if(appcontrolobject) {
            appcontrolobject.start(dataList, function(cbtype, appControlId, operationId, resultList) {
                var i;
                var mediaFiles = [];
                if(cbtype === "onAppControlCompleted") {
                    for(i = 1 ; i < resultList.length ; i += 1) {
                       if(resultList[i]) {
                           //console.log("resultList[" + i + "] = " + resultList[i]);
                           mediaFiles.push( {path: resultList[i]} );
                       }
                    }
                    success(mediaFiles);
                } else {
                    var error = {message: "An error occured while capturing image", code: 0};
                    fail(error);
                }
            });
        }

    },
};
