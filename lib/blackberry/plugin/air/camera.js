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
