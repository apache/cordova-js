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

// Helper function to inject a <script> tag.
// Exported for testing.
exports.injectScript = function (url, onload, onerror) {
    var script = document.createElement('script');
    // onload fires even when script fails loads with an error.
    script.onload = onload;
    // onerror fires for malformed URLs.
    script.onerror = onerror;
    script.src = url;
    document.head.appendChild(script);
};

function injectIfNecessary (id, url, onload, onerror) {
    onerror = onerror || onload;
    if (id in define.moduleMap) {
        onload();
    } else {
        exports.injectScript(url, function () {
            if (id in define.moduleMap) {
                onload();
            } else {
                onerror('Module not inserted to module map.');
            }
        }, onerror);
    }
}

function onScriptLoadingComplete (moduleList, finishPluginLoading) {
    // Loop through all the plugins and then through their clobbers and merges.
    for (var i = 0, module; (module = moduleList[i]); i++) {
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
        if (module.runs) {
            modulemapper.runs(module.id);
        }
    }

    finishPluginLoading();
}

// Handler for the cordova_plugins.js content.
// See plugman's plugin_loader.js for the details of this object.
// This function is only called if the really is a plugins array that isn't empty.
// Otherwise the onerror response handler will just call finishPluginLoading().
function handlePluginsObject (path, moduleList, finishPluginLoading) {
    // Now inject the scripts.
    var scriptCounter = moduleList.length;
    var modulesWithProblems = [];

    if (!scriptCounter) {
        finishPluginLoading();
        return;
    }

    function callOnScriptLoadingComplete () {
        var loadedModules = moduleList.filter(function (m) {
            return modulesWithProblems.indexOf(m.id) === -1;
        });
        onScriptLoadingComplete(loadedModules, finishPluginLoading);
    }

    function scriptLoadedCallback () {
        if (!--scriptCounter) {
            callOnScriptLoadingComplete();
        }
    }

    function scriptLoadedErrorCallback (id, message, source, lineno, colno, error) {
        modulesWithProblems.push(id);
        if (typeof message !== 'undefined') {
            var messageString = message;
            if (typeof message !== 'string') {
                messageString = JSON.stringify(message);
            }
            messageString = 'Could not load all functions. Please confirm or restart your application. \n \n' +
            'Details: Error while loading module: "' + id + '". Module will be skipped. ' + messageString;
            console.error(messageString);
            // use this comment as search & replace marker to insert a more app specific error handling in your after_platform_add hook.
            // Decide if the app can start even if plugin loading of a specific plugin has failed.
        }
        if (!--scriptCounter) {
            callOnScriptLoadingComplete();
        }
    }

    for (var i = 0; i < moduleList.length; i++) {
        var moduleId = moduleList[i].id;
        // bound function to have the module id when the error occurs.
        var boundErrorCallback = scriptLoadedErrorCallback.bind(null, moduleId);
        injectIfNecessary(moduleId, path + moduleList[i].file,
            scriptLoadedCallback, boundErrorCallback);
    }
}

function findCordovaPath () {
    var path = null;
    var scripts = document.getElementsByTagName('script');
    var term = '/cordova.js';
    for (var n = scripts.length - 1; n > -1; n--) {
        var src = scripts[n].src.replace(/\?.*$/, ''); // Strip any query param (CB-6007).
        if (src.indexOf(term) === (src.length - term.length)) {
            path = src.substring(0, src.length - term.length) + '/';
            break;
        }
    }
    return path;
}

// Tries to load all plugins' js-modules.
// This is an async process, but onDeviceReady is blocked on onPluginsReady.
// onPluginsReady is fired when there are no plugins to load, or they are all done.
exports.load = function (callback) {
    var pathPrefix = findCordovaPath();
    if (pathPrefix === null) {
        console.log('Could not find cordova.js script tag. Plugin loading may fail.');
        pathPrefix = '';
    }
    injectIfNecessary('cordova/plugin_list', pathPrefix + 'cordova_plugins.js', function () {
        var moduleList = require('cordova/plugin_list');
        handlePluginsObject(pathPrefix, moduleList, callback);
    }, callback);
};
