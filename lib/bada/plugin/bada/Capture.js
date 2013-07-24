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
                var pluginResult = [];
                if(cbtype === "onAppControlCompleted") {
                    for(i = 1 ; i < resultList.length ; i += 1) {
                        if(resultList[i]) {
                            //console.log("resultList[" + i + "] = " + resultList[i]);
                            pluginResult.push( {fullPath: resultList[i]} );
                        }
                    }
                    success(pluginResult);
                } else {
                    var error = {message: "An error occurred while capturing image", code: 0};
                    fail(error);
                }
            });
        }
    },
    captureVideo: function(success, fail, options) {
        var dataList = [];
        dataList[0] = "type:camcorder";

        var appcontrolobject = Osp.App.AppManager.findAppControl("osp.appcontrol.provider.camera", "osp.appcontrol.operation.record");

        if(appcontrolobject) {
            appcontrolobject.start(dataList, function(cbtype, appControlId, operationId, resultList) {
                var i;
                var mediaFiles = [];
                if(cbtype === "onAppControlCompleted") {
                    for(i = 1 ; i < resultList.length ; i += 1) {
                        if(resultList[i]) {
                            //console.log("resultList[" + i + "] = " + resultList[i]);
                            mediaFiles.push( {fullPath: resultList[i]} );
                        }
                    }
                    success(mediaFiles);
                } else {
                    var error = {message: "An error occurred while capturing image", code: 0};
                    fail(error);
                }
            });
        }

    }
};
