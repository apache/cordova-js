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

// Why would this be needed if all we did was http calls?
var cordova = require('cordova');
// what does this do?
var execProxy = require('cordova/exec/proxy');

/* Pretty much every plugin, under the hood will make a call
 * to this method passing the service/action/args to specify
 * what they want to do. This would act as part of the bridge
 * to the native code, but in our case we'll just format urls
 * probably in the form of "root.com/api/service/action?params=args"
 * 
 * Check out ios, their exec uses xhr for some communications
 * which is what we are likely to use.
*/
module.exports = function(success, fail, service, action, args) {
    console.log("Calling " + service + " :: " + action + " args:: " + args);
    var proxy = execProxy.get(service,action);
    if(proxy) {
        var callbackId = service + cordova.callbackId++;
        console.log("EXEC:" + service + " : " + action);
        if (typeof success == "function" || typeof fail == "function") {
            cordova.callbacks[callbackId] = {success:success, fail:fail};
        }
        try {
            proxy(success, fail, args);
        }
        catch(e) {
            console.log("Exception calling native with command :: " + service + " :: " + action  + " ::exception=" + e);
        }
    }
    else {
        fail && fail("Missing Command Error :: " + service + " :: " + action + " args:: " + args);
    }
};
