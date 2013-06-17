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

/*global tizen:false */
var channel = require('cordova/channel');

//console.log("TIZEN DEVICE START");


// Tell cordova channel to wait on the CordovaInfoReady event - PPL is this useful?
//channel.waitForInitialization('onCordovaInfoReady');

function Device() {
    this.version = "2.1.0"; // waiting a working solution of the security error see below
    this.uuid = null;
    this.model = null;
    this.cordova = CORDOVA_JS_BUILD_LABEL;
    this.platform = "Tizen";
   
    this.getDeviceInfo();
}

Device.prototype.getDeviceInfo = function() {

    var deviceCapabilities =  tizen.systeminfo.getCapabilities();

    if (deviceCapabilities) {
        this.version = deviceCapabilities.platformVersion; // requires http://tizen.org/privilege/system  (and not "systeminfo")  privileges to be added in config.xml
        this.uuid = deviceCapabilities.duid;
        this.model = deviceCapabilities.platformName;
        
        channel.onCordovaInfoReady.fire();
     }
     else {
         console.log("error initializing cordova: ");
     }
};

module.exports = new Device();

//console.log("TIZEN DEVICE END");


