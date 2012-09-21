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

describe("network", function () {
    var network,
        exec = require('cordova/exec'),
        channel = require('cordova/channel');
       
    it("should fire exec on first-run after CordovaReady fires", function() {
        exec.reset();

        network = require('cordova/plugin/network');
        channel.onCordovaReady.fire();

        expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "NetworkStatus", "getConnectionInfo", []);
    });

    //TODO: There is a lot of code executed on the first require call to this plugin
    //      we should refactor or find a good way to call and test this code.
    //      
    //      since exec is a spy we can scrounge the list of calls to find it, but I would
    //      rather refactor to have something a little cleaner (maybe move this code into the init
    //      routine for the platform)

    it("can get the network info", function () {
        var success = jasmine.createSpy(),
            error = jasmine.createSpy();

        network.getInfo(success, error);
        expect(exec).toHaveBeenCalledWith(success, error, "NetworkStatus", "getConnectionInfo", []);
    });
});
