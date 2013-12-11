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

var modulemapper = require('cordova/modulemapper');
var urlutil = require('cordova/urlutil');

// Helper function to inject a <script> tag.
function injectScript(url, onload, onerror) {
    var script = document.createElement("script");
    // onload fires even when script fails loads with an error.
    script.onload = onload;
    script.onerror = onerror || onload;
    script.src = url;
    document.head.appendChild(script);
}

function onScriptLoadingComplete(moduleList, finishPluginLoading) {
    // Loop through all the plugins and then through their clobbers and merges.
    for (var i = 0, module; module = moduleList[i]; i++) {
        if (module) {
            try {
                if (module.clobbers && module.clobbers.length) {
                    for (var j = 0; j < module.clobbers.length; j++) {
                        modulemapper.clobbers(module.id, module.clobbers[j]);
                    }
                }

                if (module.merges && module.merges.length) {
                    for (var k = 0; k < module.merges.length; k++) {
                        modulemapper.merges(module.id, module.merges[k]);
                    }
                }

                // Finally, if runs is truthy we want to simply require() the module.
                // This can be skipped if it had any merges or clobbers, though,
                // since the mapper will already have required the module.
                if (module.runs && !(module.clobbers && module.clobbers.length) && !(module.merges && module.merges.length)) {
                    modulemapper.runs(module.id);
                }
            }
            catch(err) {
                // error with module, most likely clobbers, should we continue?
            }
        }
    }

    finishPluginLoading();
}

// Handler for the cordova_plugins.js content.
// See plugman's plugin_loader.js for the details of this object.
// This function is only called if the really is a plugins array that isn't empty.
// Otherwise the onerror response handler will just call finishPluginLoading().
function handlePluginsObject(path, moduleList, finishPluginLoading) {
    // Now inject the scripts.
    var scriptCounter = moduleList.length;

    if (!scriptCounter) {
        finishPluginLoading();
        return;
    }
    function scriptLoadedCallback() {
        if (!--scriptCounter) {
            onScriptLoadingComplete(moduleList, finishPluginLoading);
        }
    }

    for (var i = 0; i < moduleList.length; i++) {
        injectScript(path + moduleList[i].file, scriptLoadedCallback);
    }
}

function injectPluginScript(pathPrefix, finishPluginLoading) {
    var pluginPath = pathPrefix + 'cordova_plugins.js';

    if (urlutil.exists(pluginPath)) {
        injectScript(pluginPath, function() {
            try {
                var moduleList = require("cordova/plugin_list");
                handlePluginsObject(pathPrefix, moduleList, finishPluginLoading);
            }
            catch (e) {
                // Error loading cordova_plugins.js, file not found or something
                // this is an acceptable error, pre-3.0.0, so we just move on.
                finishPluginLoading();
            }
        }, finishPluginLoading); // also, add script load error handler for file not found
    }
}

function findCordovaPath() {
    var path = null;
    var scripts = document.getElementsByTagName('script');
    var term = 'cordova.js';
    for (var n = scripts.length-1; n>-1; n--) {
        var src = scripts[n].src;
        if (src.indexOf(term) == (src.length - term.length)) {
            path = src.substring(0, src.length - term.length);
            break;
        }
    }
    return path;
}

// Tries to load all plugins' js-modules.
// This is an async process, but onDeviceReady is blocked on onPluginsReady.
// onPluginsReady is fired when there are no plugins to load, or they are all done.
exports.load = function(callback) {
    var pathPrefix = findCordovaPath();
    if (pathPrefix === null) {
        console.log('Could not find cordova.js script tag. Plugin loading may fail.');
        pathPrefix = '';
    }
    injectPluginScript(pathPrefix, callback);
};

