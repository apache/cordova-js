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
        'Compass' : require('cordova/plugin/blackberry10/magnetometer'),
        'FileTransfer': require('cordova/plugin/blackberry10/fileTransfer')
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
        params[name] = escape(encodeURIComponent(JSON.stringify(value)));
    };

    this.makeSyncCall = function () {
        var request = createXhrRequest(composeUri(), false),
            response;

        request.send(JSON.stringify(params));
        response = JSON.parse(decodeURIComponent(unescape(request.responseText)) || "null");
        return response;
    };
}


function exec (success, fail, service, action, args) {
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

    didSucceed = response.code === cordova.callbackStatus.OK || response.code === cordova.callbackStatus.NO_RESULT;
    cordova.callbackFromNative(callbackId, didSucceed, response.code, [ didSucceed ? response.data : response.msg ], !!response.keepCallback);
}

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
    return exec(success, fail, service, action, args);
};
