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

var CompassHeading = require('cordova/plugin/CompassHeading'),
    CompassError = require('cordova/plugin/CompassError');

module.exports = {
    getHeading: function (win, lose) {
        // only TouchPad and Pre3 have a Compass/Gyro
        if (window.device.name !== "TouchPad" && window.device.name !== "Prē3") {
            lose({code: CompassError.COMPASS_NOT_SUPPORTED});
        } else {
            console.error("webos plugin compass getheading");
            var onReadingChanged = function (e) {
                document.removeEventListener("compass", onReadingChanged);
                win(CompassHeading(e.magHeading, e.trueHeading));
            };
            document.addEventListener("compass", onReadingChanged);
        }
    }
};
