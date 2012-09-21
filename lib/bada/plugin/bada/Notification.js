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

module.exports = {
    alert: function(message, alertCallback, title, buttonName) {
        alert(message);
    },
    confirm: function(message, confirmCallback, title, buttonLabels) {
        alert(message);
    },
    beep: function(times, milliseconds) {
        try {
            deviceapis.deviceinteraction.stopNotify();
            if(times === 0) {
                return;
            }
            deviceapis.deviceinteraction.startNotify(function() {
                console.log("Notifying");
            },
            function(e) {
                console.log("Failed to notify: " + e);
            },
            milliseconds);
            Osp.Core.Function.delay(this.beep, 1000+milliseconds, this, times - 1, milliseconds);
        }
        catch(e) {
            console.log("Exception thrown: " + e);
        }
    },
    vibrate: function(milliseconds) {
        try {
            deviceapis.deviceinteraction.startVibrate(function() {
                console.log("Vibrating...");
            },
            function(e) {
                console.log("Failed to vibrate: " + e);
            },
            milliseconds);
        }
        catch(e) {
            console.log("Exception thrown: " + e);
        }
        },
    lightOn: function(milliseconds) {
        deviceapis.deviceinteraction.lightOn(function() {
            console.log("Lighting for "+milliseconds+" second");
        },
        function() {
            console.log("Failed to light");
        },
        milliseconds);
    }
};
