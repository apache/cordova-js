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
        var onCaptureAudioWin = function(filePath){
            // for some reason the filePath is coming back as a string between two double quotes
            filePath = filePath.slice(1, filePath.length-1);
            var file = blackberry.io.file.getFileProperties(filePath);

            win([{
                fullPath: filePath,
                lastModifiedDate: file.dateModified,
                name: filePath.replace(file.directory + "/", ""),
                size: file.size,
                type: file.fileExtension
            }]);
        };

        var onCaptureAudioFail = function(){
            fail([]);
        };

        if (args[0].limit > 0 && args[0].duration){
            // a sloppy way of creating a uuid since there's no built in date function to get milliseconds since epoch
            // might be better to instead check files within directory and then figure out the next file name should be
            // ie, img000 -> img001 though that would take awhile and would add a whole bunch of checks
            var id = new Date();
            id = (id.getDay()).toString() + (id.getHours()).toString() + (id.getSeconds()).toString() + (id.getMilliseconds()).toString() + (id.getYear()).toString();

            var fileName = blackberry.io.dir.appDirs.shared.music.path+'/audio'+id+'.wav';
            blackberry.media.microphone.record(fileName, onCaptureAudioWin, onCaptureAudioFail);
            // multiple duration by a 1000 since it comes in as seconds
            setTimeout(blackberry.media.microphone.stop,args[0].duration*1000);
        }
        else {
            win([]);
        }
        return {"status": cordova.callbackStatus.NO_RESULT, "message": "WebWorks Is On It"};
    }
};
