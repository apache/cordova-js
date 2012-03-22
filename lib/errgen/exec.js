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

/**
 * Execute a cordova command.  It is up to the native side whether this action
 * is synchronous or asynchronous.  The native side can return:
 *      Synchronous: PluginResult object as a JSON string
 *      Asynchrounous: Empty string ""
 * If async, the native side will cordova.callbackSuccess or cordova.callbackError,
 * depending upon the result of the action.
 *
 * @param {Function} success    The success callback
 * @param {Function} fail       The fail callback
 * @param {String} service      The name of the service to use
 * @param {String} action       Action to be run in cordova
 * @param {String[]} [args]     Zero or more arguments to pass to the method
 */

//------------------------------------------------------------------------------
module.exports = function exec(success, fail, service, action, args) {
    var signature = service + "::" + action

    //--------------------------------------------------------------------------
    function callFail() {
        var args = "<unable to JSONify>"
        
        try {
            args = JSON.stringify(args)
        }
        catch (e) {}

        var call = signature + "(" + args + ")"

        if (!fail) {
            console.log("failure callback not set for " + call)
            return
        }
        
        if (typeof(fail) != 'function') {
            console.log("failure callback not a function for " + call)
            return
        }
        
        try {
            fail("expected errgen failure for " + call)
        }
        catch (e) {
            console.log("exception running failure callback for " + call)
            console.log("   exception: " + e)
            return
        }
    }

    //--------------------------------------------------------------------------
    if (Overrides[signature]) {
        Overrides[signature].call(null, success, fail, args)
        return
    }
    
    setTimeout(callFail, 10)
}

//------------------------------------------------------------------------------
var Overrides = {}

//------------------------------------------------------------------------------
function addOverride(func) {
    var name = func.name.replace('__', '::')
    Overrides[name] = func
}

//------------------------------------------------------------------------------
addOverride(function Accelerometer__setTimeout(success, fail, args) {
    setTimeout(function() { 
        fail("Accelerometer::setTimeout") 
    }, 10)
})

//------------------------------------------------------------------------------
addOverride(function Accelerometer__getTimeout(success, fail, args) {
    setTimeout(function() { 
        fail("Accelerometer::getTimeout") 
    }, 10)
})

//------------------------------------------------------------------------------
addOverride(function Network_Status__getConnectionInfo(success, fail) {
    setTimeout(function() { 
        success("none")
    }, 10)
})
