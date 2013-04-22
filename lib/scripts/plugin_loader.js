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

// Tries to load all plugins' js-modules.
// This is an async process, but onDeviceReady is blocked on onPluginsReady.
// onPluginsReady is fired when there are no plugins to load, or they are all done.
(function (context) {
    // To be populated with the handler by handlePluginsObject.
    var onScriptLoadingComplete;

    var scriptCounter = 0;
    function scriptLoadedCallback() {
        scriptCounter--;
        if (scriptCounter === 0) {
            onScriptLoadingComplete && onScriptLoadingComplete();
        }
    }

    // Helper function to inject a <script> tag.
    function injectScript(path) {
        scriptCounter++;
        var script = document.createElement("script");
        script.onload = scriptLoadedCallback;
        script.src = path;
        document.head.appendChild(script);
    }

    // Called when:
    // * There are plugins defined and all plugins are finished loading.
    // * There are no plugins to load.
    function finishPluginLoading() {
        context.cordova.require('cordova/channel').onPluginsReady.fire();
    }

    // Handler for the cordova_plugins.json content.
    // See plugman's plugin_loader.js for the details of this object.
    // This function is only called if the really is a plugins array that isn't empty.
    // Otherwise the XHR response handler will just call finishPluginLoading().
    function handlePluginsObject(modules) {
        // First create the callback for when all plugins are loaded.
        var mapper = context.cordova.require('cordova/modulemapper');
        onScriptLoadingComplete = function() {
            // Loop through all the plugins and then through their clobbers and merges.
            for (var i = 0; i < modules.length; i++) {
                var module = modules[i];
                if (!module) continue;

                if (module.clobbers && module.clobbers.length) {
                    for (var j = 0; j < module.clobbers.length; j++) {
                        mapper.clobbers(module.id, module.clobbers[j]);
                    }
                }

                if (module.merges && module.merges.length) {
                    for (var k = 0; k < module.merges.length; k++) {
                        mapper.merges(module.id, module.merges[k]);
                    }
                }

                // Finally, if runs is truthy we want to simply require() the module.
                // This can be skipped if it had any merges or clobbers, though,
                // since the mapper will already have required the module.
                if (module.runs && !(module.clobbers && module.clobbers.length) && !(module.merges && module.merges.length)) {
                    context.cordova.require(module.id);
                }
            }

            finishPluginLoading();
        };

        // Now inject the scripts.
        for (var i = 0; i < modules.length; i++) {
            injectScript(modules[i].file);
        }
    }


    // Try to XHR the cordova_plugins.json file asynchronously.
    try { // we commented we were going to try, so let us actually try and catch
        var xhr = new context.XMLHttpRequest();
        xhr.onload = function() {
            // If the response is a JSON string which composes an array, call handlePluginsObject.
            // If the request fails, or the response is not a JSON array, just call finishPluginLoading.
            var obj = this.responseText && JSON.parse(this.responseText);
            if (obj && obj instanceof Array && obj.length > 0) {
                handlePluginsObject(obj);
            } else {
                finishPluginLoading();
            }
        };
        xhr.onerror = function() {
            finishPluginLoading();
        };
        xhr.open('GET', 'cordova_plugins.json', true); // Async
        xhr.send();
    }
    catch(err){
        finishPluginLoading();
    }
}(window));

