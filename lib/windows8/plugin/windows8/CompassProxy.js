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


/*global Windows:true */
var cordova = require('cordova'),
    CompassHeading = require('cordova/plugin/CompassHeading');


module.exports = {

    onReadingChanged:null,
    getHeading:function(win,lose) {
        var deviceCompass = Windows.Devices.Sensors.Compass.getDefault();
        if(!deviceCompass) {
            setTimeout(function(){lose("Compass not available");},0);
        }
        else {

            deviceCompass.reportInterval = Math.max(16,deviceCompass.minimumReportInterval);

            this.onReadingChanged = function(e) {
                var reading = e.reading;
                var heading = new CompassHeading(reading.headingMagneticNorth, reading.headingTrueNorth);
                win(heading);
            };
            deviceCompass.addEventListener("readingchanged",this.onReadingChanged);
        }

    },
    stopHeading:function(win,lose) {
        var deviceCompass = Windows.Devices.Sensors.Compass.getDefault();
        if(!deviceCompass) {
            setTimeout(function(){lose("Compass not available");},0);
        }
        else {

            deviceCompass.removeEventListener("readingchanged",this.onReadingChanged);
            this.onReadingChanged = null;
            deviceCompass.reportInterval = 0;
            win();
        }

    }
};

require("cordova/commandProxy").add("Compass",module.exports);