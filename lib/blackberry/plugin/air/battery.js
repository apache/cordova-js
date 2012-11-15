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

module.exports = {
    start: function (args, win, fail) {
        // Register one listener to each of the level and state change
        // events using WebWorks API.
        blackberry.system.event.deviceBatteryStateChange(function(state) {
            var me = navigator.battery;
            // state is either CHARGING or UNPLUGGED
            if (state === 2 || state === 3) {
                var info = {
                    "level" : me._level,
                    "isPlugged" : state === 2
                };

                if (me._isPlugged !== info.isPlugged && typeof win === 'function') {
                    win(info);
                }
            }
        });
        blackberry.system.event.deviceBatteryLevelChange(function(level) {
            var me = navigator.battery;
            if (level != me._level && typeof win === 'function') {
                win({'level' : level, 'isPlugged' : me._isPlugged});
            }
        });

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },
    stop: function (args, win, fail) {
        // Unregister battery listeners.
        blackberry.system.event.deviceBatteryStateChange(null);
        blackberry.system.event.deviceBatteryLevelChange(null);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    }
};
