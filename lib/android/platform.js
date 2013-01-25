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
    id: "android",
    initialize:function() {
        var channel = require("cordova/channel"),
            cordova = require('cordova'),
            exec = require('cordova/exec'),
            modulemapper = require('cordova/modulemapper');

        modulemapper.loadMatchingModules(/cordova.*\/symbols$/);
        modulemapper.mapModules(window);

        // Inject a listener for the backbutton on the document.
        var backButtonChannel = cordova.addDocumentEventHandler('backbutton');
        backButtonChannel.onHasSubscribersChange = function() {
            // If we just attached the first handler or detached the last handler,
            // let native know we need to override the back button.
            exec(null, null, "App", "overrideBackbutton", [this.numHandlers == 1]);
        };

        // Add hardware MENU and SEARCH button handlers
        cordova.addDocumentEventHandler('menubutton');
        cordova.addDocumentEventHandler('searchbutton');

        // Figure out if we need to shim-in localStorage and WebSQL
        // support from the native side.
        var storage = require('cordova/plugin/android/storage');

        // First patch WebSQL if necessary
        if (typeof window.openDatabase == 'undefined') {
            // Not defined, create an openDatabase function for all to use!
            window.openDatabase = storage.openDatabase;
        } else {
            // Defined, but some Android devices will throw a SECURITY_ERR -
            // so we wrap the whole thing in a try-catch and shim in our own
            // if the device has Android bug 16175.
            var originalOpenDatabase = window.openDatabase;
            window.openDatabase = function(name, version, desc, size) {
                var db = null;
                try {
                    db = originalOpenDatabase(name, version, desc, size);
                }
                catch (ex) {
                    if (ex.code === 18) {
                        db = null;
                    } else {
                        throw ex;
                    }
                }

                if (db === null) {
                    return storage.openDatabase(name, version, desc, size);
                }
                else {
                    return db;
                }

            };
        }

        // Patch localStorage if necessary
        if (typeof window.localStorage == 'undefined' || window.localStorage === null) {
            window.localStorage = new storage.CupcakeLocalStorage();
        }

        // Let native code know we are all done on the JS side.
        // Native code will then un-hide the WebView.
        channel.join(function() {
            exec(null, null, "App", "show", []);
        }, [channel.onCordovaReady]);
    }
};
