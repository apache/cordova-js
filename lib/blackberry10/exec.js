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
    plugins = {
        'Accelerometer' : require('cordova/plugin/blackberry10/accelerometer'),
        'Compass' : require('cordova/plugin/blackberry10/magnetometer'),
        'Camera' : require('cordova/plugin/blackberry10/camera'),
        'Capture' : require('cordova/plugin/blackberry10/capture'),
        'Logger' : require('cordova/plugin/blackberry10/logger'),
        'Notification' : require('cordova/plugin/blackberry10/notification'),
        'Media': require('cordova/plugin/blackberry10/media'),
        'InAppBrowser' : require('cordova/plugin/blackberry10/InAppBrowser'),
        'FileTransfer': require('cordova/plugin/blackberry10/fileTransfer')
    };

/**
 * Execute a cordova command.  It is up to the native side whether this action
 * is synchronous or asynchronous.  The native side can return:
 *      Synchronous: PluginResult object as a JSON string
 *      Asynchronous: Empty string ""
 * If async, the native side will cordova.callbackSuccess or cordova.callbackError,
 * depending upon the result of the action.
 *
 * @param {Function} success    The success callback
 * @param {Function} fail       The fail callback
 * @param {String} service      The name of the service to use
 * @param {String} action       Action to be run in cordova
 * @param {String[]} [args]     Zero or more arguments to pass to the method
 */
module.exports = function (success, fail, service, action, args) {
    if (plugins[service] && plugins[service][action]) {
        return plugins[service][action](args, success, fail);
    }
    return webworks.exec(success, fail, service, action, args);
};

function RemoteFunctionCall(functionUri) {
     var params = {};

    function composeUri() {
        return require("cordova/plugin/blackberry10/utils").getURIPrefix() + functionUri;
    }

    function createXhrRequest(uri, isAsync) {
        var request = new XMLHttpRequest();
        request.open("POST", uri, isAsync);
        request.setRequestHeader("Content-Type", "application/json");
        return request;
    }

    this.addParam = function (name, value) {
        params[name] = encodeURIComponent(JSON.stringify(value));
    };

    this.makeSyncCall = function (success, error) {
        var requestUri = composeUri(),
            request = createXhrRequest(requestUri, false),
            response,
            errored,
            cb,
            data;

        request.send(JSON.stringify(params));
        response = JSON.parse(decodeURIComponent(request.responseText) || "null");
        return response;
    };
}

window.webworks = {
    exec: function (success, fail, service, action, args) {
        var uri = service + "/" + action,
            request = new RemoteFunctionCall(uri),
            callbackId = service + cordova.callbackId++,
            response,
            name,
            didSucceed;

        for (name in args) {
            if (Object.hasOwnProperty.call(args, name)) {
                request.addParam(name, args[name]);
            }
        }

        cordova.callbacks[callbackId] = {success:success, fail:fail};
        request.addParam("callbackId", callbackId);

        response = request.makeSyncCall();

        //Old WebWorks Extension success
        if (response.code === 42) {
            if (success) {
                success(response.data, response);
            }
            delete cordova.callbacks[callbackId];
        } else if (response.code < 0) {
            if (fail) {
                fail(response.msg, response);
            }
            delete cordova.callbacks[callbackId];
        } else {
            didSucceed = response.code === cordova.callbackStatus.OK || response.code === cordova.callbackStatus.NO_RESULT;
            cordova.callbackFromNative(callbackId, didSucceed, response.code, didSucceed ? response.data : response.msg, !!response.keepCallback);
        }
    },
    defineReadOnlyField: function (obj, field, value) {
        Object.defineProperty(obj, field, {
            "value": value,
            "writable": false
        });
    },
    event: require("cordova/plugin/blackberry10/event")
};
