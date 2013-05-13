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

/**
 * Execute a cordova command.  It is up to the native side whether this action
 * is synchronous or asynchronous.  The native side can return:
 *      Synchronous: PluginResult object as a JSON string
 *      Asynchronous: Empty string ""
 * If async, the native side will cordova.callbackSuccess or cordova.callbackError,
 * depending upon the result of the action.
 *
 * @param {Function} successCB  The success callback
 * @param {Function} failCB     The fail callback
 * @param {String} service      The name of the service to use
 * @param {String} action       Action to be run in cordova
 * @param {String[]} [args]     Zero or more arguments to pass to the method
 */
/**
 * Execute a cordova command.  It is up to the native side whether this action
 * is synchronous or asynchronous.  The native side can return:
 *      Synchronous: PluginResult object as a JSON string
 *      Asynchronous: Empty string ""
 * If async, the native side will cordova.callbackSuccess or cordova.callbackError,
 * depending upon the result of the action.
 *
 * @param {Function} successCB  The success callback
 * @param {Function} failCB     The fail callback
 * @param {String} service      The name of the service to use
 * @param {String} action       Action to be run in cordova
 * @param {String[]} [args]     Zero or more arguments to pass to the method
 */

console.log("TIZEN EXEC START");


var manager = require('cordova/plugin/tizen/manager'),
    cordova = require('cordova'),
    utils = require('cordova/utils');

console.log("TIZEN EXEC START 2");

module.exports = function(successCB, failCB, service, action, args) {

    try {
        var v = manager.exec(successCB, failCB, service, action, args);

        // If status is OK, then return value back to caller
        if (v.status == cordova.callbackStatus.OK) {

            // If there is a success callback, then call it now with returned value
            if (successCB) {
                try {
                    successCB(v.message);
                }
                catch (e) {
                    console.log("Error in success callback: "+ service + "." + action + " = " + e);
                }

            }
            return v.message;
        } else if (v.status == cordova.callbackStatus.NO_RESULT) {
            // Nothing to do here
        } else {
            // If error, then display error
            console.log("Error: " + service + "." + action + " Status=" + v.status + " Message=" + v.message);

            // If there is a fail callback, then call it now with returned value
            if (failCB) {
                try {
                    failCB(v.message);
                }
                catch (e) {
                    console.log("Error in error callback: " + service + "." + action + " = "+e);
                }
            }
            return null;
        }
    } catch (e) {
        utils.alert("Error: " + e);
    }
};

console.log("TIZEN EXEC END ");

/*
var plugins = {
    "Device": require('cordova/plugin/tizen/Device'),
    "NetworkStatus": require('cordova/plugin/tizen/NetworkStatus'),
    "Accelerometer": require('cordova/plugin/tizen/Accelerometer'),
    "Battery": require('cordova/plugin/tizen/Battery'),
    "Compass": require('cordova/plugin/tizen/Compass'),
    //"Capture": require('cordova/plugin/tizen/Capture'), not yet available
    "Camera": require('cordova/plugin/tizen/Camera'),
    "FileTransfer": require('cordova/plugin/tizen/FileTransfer'),
    "Media": require('cordova/plugin/tizen/Media'),
    "Notification": require('cordova/plugin/tizen/Notification')
};

console.log("TIZEN EXEC START");

module.exports = function(success, fail, service, action, args) {
    try {
        console.log("exec: " + service + "." + action);
        plugins[service][action](success, fail, args);
    }
    catch(e) {
        console.log("missing exec: " + service + "." + action);
        console.log(args);
        console.log(e);
        console.log(e.stack);
    }
};

console.log("TIZEN EXEC START");
*/
