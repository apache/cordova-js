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

var callback;
var failureTimer;
var clearTimer = function() {
    if(failureTimer!=undefined) {
        window.clearInterval(failureTimer);
        failureTimer = undefined;
    }
};

module.exports = {
    start: function(onSuccess, onFailure) {
        document.removeEventListener("acceleration", callback);
        callback = function(event) {
            clearTimer();
            onSuccess({x:(event.accelX*-9.81), y:(event.accelY*-9.81), z:(event.accelZ*-9.81)});
        };
        document.addEventListener("acceleration", callback);
        // timeout every 5 seconds unable to access accelerometer
        failureTimer = window.setInterval(function() {
            onFailure("Accelerometer not available");
        }, 5000);
    },
    stop: function(onSuccess, onFailure) {
        clearTimer();
        document.removeEventListener("acceleration", callback);
    }
};
