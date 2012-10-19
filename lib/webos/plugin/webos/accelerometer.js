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
module.exports = {
    /*
     * Tells WebOS to put higher priority on accelerometer resolution. Also relaxes the internal garbage collection events.
     * @param {Boolean} state
     * Dependencies: Mojo.windowProperties
     * Example:
     *         navigator.accelerometer.setFastAccelerometer(true)
     */
    setFastAccelerometer: function(state) {
        navigator.windowProperties.fastAccelerometer = state;
        navigator.window.setWindowProperties();
    },

    /*
     * Starts the native acceleration listener.
     */
    start: function(win,fail,args) {
        console.error("webos plugin accelerometer start");
        window.removeEventListener("acceleration", callback);
        callback = function(event) {
            var accel = new Acceleration(event.accelX*-9.81, event.accelY*-9.81, event.accelZ*-9.81);
            win(accel);
        };
        document.addEventListener("acceleration", callback);
    },
    stop: function (win,fail,args) {
        console.error("webos plugin accelerometer stop");
        window.removeEventListener("acceleration", callback);
    }
};
