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

describe("blackberry qnx device", function () {
    var device = require('cordova/plugin/qnx/device');
    
    it("calls the win callback with the device info", function () {
        global.blackberry = {
            system: {
                softwareVersion: "NaN"
            },
            identity: {
                uuid: 1
            }
        };

        var info;

        //HACK: I know this is a sync call ;)
        device.getDeviceInfo({}, function (i) { info = i; });

        expect(info.platform).toBe("BB10");
        expect(info.version).toBe("NaN");
        expect(info.name).toBe("Dev Alpha");
        expect(info.uuid).toBe(1);
        expect(info.cordova).toBeDefined();
        
        delete global.blackberry;
    });
});
