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

document.addEventListener("DOMContentLoaded", function () {
    var wwjs;
    switch(require('cordova/platform').runtime()) {
    case 'qnx':
        wwjs = document.createElement("script");
        wwjs.type = "text/javascript";
        wwjs.src = "local:///chrome/webworks.js";
        wwjs.onload = function () {
            document.addEventListener("webworksready", function () {
                require('cordova/channel').onNativeReady.fire();
            });
        };
        document.getElementsByTagName("head")[0].appendChild(wwjs);
        break;
    case 'air':
        require('cordova/channel').onNativeReady.fire();
        break;
    case 'java':
        //nothing to do for java
        break;
    }
});
