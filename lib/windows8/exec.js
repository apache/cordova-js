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

var cordova = require('cordova');


 /* definition of named properties expected by the native side,
    all arrays are stored in order of how they are received from common js code.
    When other platforms evolve to using named args this will be removed.
 */


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



var CommandProxy;

function getCP() {
    if (!CommandProxy) {
        CommandProxy = {
          "Accelerometer": require('cordova/plugin/windows8/AccelerometerProxy'),
          "Camera":require('cordova/plugin/windows8/CameraProxy'),
          "Capture":require('cordova/plugin/windows8/CaptureProxy'),
          "Compass":require('cordova/plugin/windows8/CompassProxy'),
          "Device":require('cordova/plugin/windows8/DeviceProxy'),
          "File":require('cordova/plugin/windows8/FileProxy'),
          "FileTransfer":require('cordova/plugin/windows8/FileTransferProxy'),
          "Media":require('cordova/plugin/windows8/MediaProxy'),
          "NetworkStatus":require('cordova/plugin/windows8/NetworkStatusProxy'),
          "Notification":require('cordova/plugin/windows8/NotificationProxy')
        };
    }
    return CommandProxy;
}

module.exports = function(success, fail, service, action, args) {
    var CommandProxy = getCP();
    if(CommandProxy[service] && CommandProxy[service][action]) {

        var callbackId = service + cordova.callbackId++;
        console.log("EXEC:" + service + " : " + action);

        if (typeof success == "function" || typeof fail == "function") {
            cordova.callbacks[callbackId] = {success:success, fail:fail};
        }
        // pass it on to Notify
        try {
            CommandProxy [service][action](success, fail, args);
        }
        catch(e) {
            console.log("Exception calling native with command :: " + service + " :: " + action  + " ::exception=" + e);
        }
    }
    else
    {
        if(fail) { fail("Missing Command Error"); }
    }

};

// cordova.exec.addCommandProxy("Accelerometer",{getCurrentAcceleration: function(successCallback, errorCallback, options) {...},...);
module.exports.addCommandProxy = function(id,proxyObj) {
    var CommandProxy = getCP();
    CommandProxy[id] = proxyObj;
};

// cordova.exec.removeCommandProxy("Accelerometer");
module.exports.removeCommandProxy = function(id) {
    var CommandProxy = getCP();
    var proxy = CommandProxy[id];
    delete CommandProxy[id];
    CommandProxy[id] = null;
    return proxy;
};





