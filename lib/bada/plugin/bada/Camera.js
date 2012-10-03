/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

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
                    var error = {message: "An error occurred while capturing image", code: 0};
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
            alert("An error occurred: " + e.message);
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

