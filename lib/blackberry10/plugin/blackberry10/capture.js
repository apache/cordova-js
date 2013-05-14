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
    var noop = function () {};

    blackberry.invoke.card.invokeCamera(action, function (path) {
        var sb = blackberry.io.sandbox;
        blackberry.io.sandbox = false;
        window.webkitRequestFileSystem(window.PERSISTENT, 1024, function (fs) {
            fs.root.getFile(path, {}, function (fe) {
                fe.file(function (file) {
                    file.fullPath = fe.fullPath;
                    win([file]);
                    blackberry.io.sandbox = sb;
                }, fail);
            }, fail);
        }, fail);
    }, noop, noop);
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
            capture("photo", win, fail);
        }
        else {
            win([]);
        }

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },
    captureVideo: function (args, win, fail) {
        if (args[0].limit > 0) {
            capture("video", win, fail);
        }
        else {
            win([]);
        }

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },
    captureAudio: function (args, win, fail) {
        fail("Capturing Audio not supported");
        return {"status": cordova.callbackStatus.NO_RESULT, "message": "WebWorks Is On It"};
    }
};
