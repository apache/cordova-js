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

var channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    app = require('cordova/plugin/android/app');

module.exports = {
    /*
     * DEPRECATED
     * This is only for Android.
     *
     * You must explicitly override the back button.
     */
    overrideBackButton:function() {
        console.log("Device.overrideBackButton() is deprecated.  Use App.overrideBackbutton(true).");
        app.overrideBackbutton(true);
    },

    /*
     * DEPRECATED
     * This is only for Android.
     *
     * This resets the back button to the default behaviour
     */
    resetBackButton:function() {
        console.log("Device.resetBackButton() is deprecated.  Use App.overrideBackbutton(false).");
        app.overrideBackbutton(false);
    },

    /*
     * DEPRECATED
     * This is only for Android.
     *
     * This terminates the activity!
     */
    exitApp:function() {
        console.log("Device.exitApp() is deprecated.  Use App.exitApp().");
        app.exitApp();
    }
};
