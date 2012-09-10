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

function _exec(win, fail, clazz, action, args) {
    var callbackId = clazz + cordova.callbackId++,
        origResult,
        evalResult,
        execResult;

    try {
        if (win || fail) {
            cordova.callbacks[callbackId] = {success: win, fail: fail};
        }

        // Note: Device returns string, but for some reason emulator returns object - so convert to string.
        origResult = "" + org.apache.cordova.JavaPluginManager.exec(clazz, action, callbackId, JSON.stringify(args), true);

        // If a result was returned
        if (origResult.length > 0) {
            evalResult = JSON.parse(origResult);

            // If status is OK, then return evalResult value back to caller
            if (evalResult.status === cordova.callbackStatus.OK) {

                // If there is a success callback, then call it now with returned evalResult value
                if (win) {
                    // Clear callback if not expecting any more results
                    if (!evalResult.keepCallback) {
                        delete cordova.callbacks[callbackId];
                    }
                }
            } else if (evalResult.status === cordova.callbackStatus.NO_RESULT) {

                // Clear callback if not expecting any more results
                if (!evalResult.keepCallback) {
                    delete cordova.callbacks[callbackId];
                }
            } else {
                // If there is a fail callback, then call it now with returned evalResult value
                if (fail) {

                    // Clear callback if not expecting any more results
                    if (!evalResult.keepCallback) {
                        delete cordova.callbacks[callbackId];
                    }
                }
            }
            execResult = evalResult;
        } else {
            // Asynchronous calls return an empty string. Return a NO_RESULT
            // status for those executions.
            execResult = {"status" : cordova.callbackStatus.NO_RESULT,
                    "message" : ""};
        }
    } catch (e) {
        console.log("BlackBerryPluginManager Error: " + e);
        execResult = {"status" : cordova.callbackStatus.ERROR,
                      "message" : e.message};
    }

    return execResult;
}

module.exports = {
    exec: function (win, fail, clazz, action, args) {
        return _exec(win, fail, clazz, action, args);
    },
    resume: org.apache.cordova.JavaPluginManager.resume,
    pause: org.apache.cordova.JavaPluginManager.pause,
    destroy: org.apache.cordova.JavaPluginManager.destroy
};
