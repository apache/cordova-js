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

var cordova = require('cordova'),
      exec = require('cordova/exec');

// specifically require the following patches :

// localStorage+SessionStorage APIs
require("cordova/plugin/windowsphone/DOMStorage");

// Fix XHR calls to local file-system
require("cordova/plugin/windowsphone/XHRPatch");


module.exports = {
    id: "windowsphone",
    initialize:function() {
        window.alert = require("cordova/plugin/notification").alert;
        window.FileReader = require("cordova/plugin/FileReader");
        window.File = require("cordova/plugin/File");


        // Inject a listener for the backbutton, and tell native to override the flag (true/false) when we have 1 or more, or 0, listeners
        var backButtonChannel = cordova.addDocumentEventHandler('backbutton');
        backButtonChannel.onHasSubscribersChange = function() {
            exec(null, null, "CoreEvents", "overridebackbutton", [this.numHandlers == 1]);
        };
    },
    objects: {
        CordovaCommandResult: {
            path:"cordova/plugin/windowsphone/CordovaCommandResult"
        },
        CordovaMediaonStatus: {
            path:"cordova/plugin/windowsphone/CordovaMediaonStatus"
        },
        navigator: {
            children: {
                device: {
                    children:{
                        capture:{
                            path:"cordova/plugin/capture"
                        }
                    }
                },
                console: {
                    path: "cordova/plugin/windowsphone/console"

                }
            }
        },
        console:{
          path: "cordova/plugin/windowsphone/console"
        },
        FileTransfer: {
            path: 'cordova/plugin/windowsphone/FileTransfer'
        }
    }
};
