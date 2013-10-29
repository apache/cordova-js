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
    id: 'windows8',
    bootstrap:function() {
        var cordova = require('cordova'),
            exec = require('cordova/exec'),
            channel = cordova.require('cordova/channel'),
            modulemapper = require('cordova/modulemapper');

        modulemapper.clobbers('cordova/exec/proxy', 'cordova.commandProxy');
        channel.onNativeReady.fire();

        var onWinJSReady = function () {
            var app = WinJS.Application;
            var checkpointHandler = function checkpointHandler() {
                cordova.fireDocumentEvent('pause');
            };

            var resumingHandler = function resumingHandler() {
                cordova.fireDocumentEvent('resume');
            };

            app.addEventListener("checkpoint", checkpointHandler);
            Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", resumingHandler, false);
            app.start();

        };

        if (!window.WinJS) {
            // <script src="//Microsoft.WinJS.1.0/js/base.js"></script>
            var scriptElem = document.createElement("script");
            scriptElem.src = "//Microsoft.WinJS.1.0/js/base.js";
            scriptElem.addEventListener("load", onWinJSReady);
            document.head.appendChild(scriptElem);

            console.log("added WinJS ... ");
        }
        else {
            onWinJSReady();
        }
    }
};
