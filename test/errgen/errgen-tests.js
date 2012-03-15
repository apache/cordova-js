/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

document.addEventListener("deviceready", onDeviceReady, false)

//------------------------------------------------------------------------------
function onDeviceReady() {
    // TODO: finish the tests
    testAccelerometer();
    testCamera();
    // testCapture();
    testCompass();
    // testConnection();
    // testContacts();
    // testDevice();
    // testEvents();
    // testFile();
    // testGeolocation();
    // testMedia();
    // testNotification();
    // testStorage();
}

//------------------------------------------------------------------------------
function getSuccessCB(api) {
    return function() {
        reportFailure(api + ": success callback was called") 
    }
}

//------------------------------------------------------------------------------
function getErrorCB(api) {
    return function() {
        reportSuccess(api + ": error callback was called") 
    }
}

//------------------------------------------------------------------------------
function testAPI(receiver, func, args) {
    if (!args) args = []
    var origArgs = args
    
    var receiverObject = eval(receiver)
    var funcObject     = receiverObject[func]
    
    var api = receiver + "." + func
    
    args.unshift(getErrorCB(api))
    args.unshift(getSuccessCB(api))
    
    return funcObject.apply(receiverObject, origArgs)
}

//------------------------------------------------------------------------------
function testAccelerometer() {
    testAPI("navigator.accelerometer", "getCurrentAcceleration")
}

//------------------------------------------------------------------------------
function testCamera() {
    testAPI("navigator.camera", "getPicture", [{
        quality:         100,
        destinationType: Camera.DestinationType.FILE_URI
    }])
}

//------------------------------------------------------------------------------
function testCompass() {
    testAPI("navigator.compass", "getCurrentHeading")
}