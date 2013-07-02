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

//Convenience wrapper around PmLogLib logging API

(function() {
    //* @protected

    // Log level constants
    var levelNone      = -1;
    var levelEmergency =  0;
    var levelAlert     =  1;
    var levelCritical  =  2;
    var levelError     =  3;
    var levelWarning   =  4;
    var levelNotice    =  5;
    var levelInfo      =  6;
    var levelDebug     =  7;
    var isObject = function(obj) {
        return !!obj && (typeof obj === "object") && (Object.prototype.toString.call(obj) !== "[object Array]");
    };

    // Log function stringifies and escapes keyVals, and passes to PmLogString
    var log = function(level, messageId, keyVals, freeText) {
        if(window.PalmSystem) {
            if (keyVals && !isObject(keyVals)) {
                level = levelError;
                keyVals = { msgid: messageId };
                messageId = "MISMATCHED_FMT";
                freeText = null;
                console.warn("webOSLog called with invalid format: keyVals must be an object");
            }
            if (!messageId && level != levelDebug) {
                console.warn("webOSLog called with invalid format: messageId was empty");
            }
            if (keyVals) {
                keyVals = JSON.stringify(keyVals);
            }
            if(window.PalmSystem.PmLogString) {
                window.PalmSystem.PmLogString(level, messageId, keyVals, freeText);
            } else {
                console.error("Unable to send log; PmLogString not found in this version of PalmSystem");
            }
        }
    };

    //* @public

    module.exports = {
        //* Call PalmSystem.PmLogString with "emergency" level
        emergency: function(messageId, keyVals, freeText) {
            log(levelEmergency, messageId, keyVals, freeText);
        },
        //* Call PalmSystem.PmLogString with "alert" level
        alert: function(messageId, keyVals, freeText) {
            log(levelAlert, messageId, keyVals, freeText);
        },
        //* Call PalmSystem.PmLogString with "critical" level
        critical: function(messageId, keyVals, freeText) {
            log(levelCritical, messageId, keyVals, freeText);
        },
        //* Call PalmSystem.PmLogString with "error" level
        error: function(messageId, keyVals, freeText) {
            log(levelError, messageId, keyVals, freeText);
        },
        //* Call PalmSystem.PmLogString with "warning" level
        warning: function(messageId, keyVals, freeText) {
            log(levelWarning, messageId, keyVals, freeText);
        },
        //* Call PalmSystem.PmLogString with "notice" level
        notice: function(messageId, keyVals, freeText) {
            log(levelNotice, messageId, keyVals, freeText);
        },
        //* Call PalmSystem.PmLogString with "info" level
        info: function(messageId, keyVals, freeText) {
            log(levelInfo, messageId, keyVals, freeText);
        },
        //* Call PalmSystem.PmLogString with "debug" level.  Note, messageId and keyVals are not allowed.
        debug: function(freeText) {
            log(levelDebug, "", "", freeText);
        }
    };
}());