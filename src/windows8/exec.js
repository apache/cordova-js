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

/*jslint sloppy:true, plusplus:true*/
/*global require, module, console */

var cordova = require('cordova');
var execProxy = require('cordova/exec/proxy');

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

    var proxy = execProxy.get(service, action),
        callbackId,
        onSuccess,
        onError;

    if (proxy) {
        callbackId = service + cordova.callbackId++;
        // console.log("EXEC:" + service + " : " + action);
        if (typeof success === "function" || typeof fail === "function") {
            cordova.callbacks[callbackId] = {success: success, fail: fail};
        }
        try {
            onSuccess = function (result) {
                cordova.callbackSuccess(callbackId,
                        {
                        status: cordova.callbackStatus.OK,
                        message: result
                    });
            };
            onError = function (err) {
                cordova.callbackError(callbackId,
                        {
                        status: cordova.callbackStatus.ERROR,
                        message: err
                    });
            };
            proxy(onSuccess, onError, args);

        } catch (e) {
            console.log("Exception calling native with command :: " + service + " :: " + action  + " ::exception=" + e);
        }
    } else {
        if (typeof fail === "function") {
            fail("Missing Command Error");
        }
    }
};
