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
var channel = require('cordova/channel');

// singular WP7 callback function attached to window, status is used to determine if it is a success or error
module.exports = function(status,callbackId,args,cast) {

    if(status === "backbutton") {
        // do not detach backbutton event, as we need to be able to catch exceptions
        cordova.fireDocumentEvent("backbutton", undefined, true);
        return "true";
    }
    else if(status === "resume") {
        cordova.fireDocumentEvent('resume');
        return "true";
    }
    else if(status === "pause") {
        cordova.fireDocumentEvent('pause');
        return "true";
    }

    var parsedArgs;
    try
    {
        parsedArgs = JSON.parse(args);

    }
    catch(ex)
    {
        console.log("Parse error in CordovaCommandResult :: " + ex);
        return;
    }

    try
    {
        // For some commands, the message is a JSON encoded string
        // and other times, it is just a string, the try/catch handles the
        // case where message was indeed, just a string.
        parsedArgs.message = JSON.parse(parsedArgs.message);
    }
    catch(ex)
    {

    }
    var safeStatus = parseInt(status, 10);
    if(safeStatus === cordova.callbackStatus.NO_RESULT ||
       safeStatus === cordova.callbackStatus.OK) {
        cordova.callbackSuccess(callbackId,parsedArgs,cast);
    }
    else {
        cordova.callbackError(callbackId,parsedArgs,cast);
    }
};
