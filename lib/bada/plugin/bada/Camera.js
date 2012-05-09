module.exports = {
    _mainCamera: null,
    _cams: [],
    takePicture: function(success, fail, cameraOptions) {
        var dataList = [];
        dataList[0] = "type:camera";

        var appcontrolobject = Osp.App.AppManager.findAppControl("osp.appcontrol.provider.camera", "osp.appcontrol.operation.capture");

        if(appcontrolobject) {
            appcontrolobject.start(dataList, function(cbtype, appControlId, operationId, resultList) {
                var i;
                if(cbtype === "onAppControlCompleted") {
                    if(resultList.length > 1 && resultList[1]) {
                        success(resultList[1]);
                    }
                } else {
                    var error = {message: "An error occured while capturing image", code: 0};
                    fail(error);
                }
            });
        }
    },
    showPreview: function(nodeId) {
        var self = this;
        var onCreatePreviewNodeSuccess = function(previewObject) {
            var previewDiv = document.getElementById(nodeId);
            previewDiv.appendChild(previewObject);
            previewObject.style.visibility = "visible";
        };
        var error = function(e) {
            alert("An error occured: " + e.message);
        };

        var success = function(cams) {
            if (cams.length > 0) {
             self._cams = cams;
                self._mainCamera = cams[0];
                self._mainCamera.createPreviewNode(onCreatePreviewNodeSuccess, error);
                return;
            }
            alert("Sorry, no cameras available.");
        };
        if(nodeId) {
            deviceapis.camera.getCameras(success, error);
        } else {
            console.log("camera::getPreview: must provide a nodeId");
        }
    },
    hidePreview: function(nodeId) {
        var preview = document.getElementById(nodeId);
        if(preview.childNodes[0]) {
            preview.removeChild(preview.childNodes[0]);
        }
    }

};

