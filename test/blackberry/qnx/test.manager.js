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

describe("blackberry qnx manager", function () {
    var manager = require('cordova/plugin/qnx/manager');

    it("calls the plugin", function () {
        var device = require('cordova/plugin/qnx/device'),
            win = jasmine.createSpy('win'),
            fail = jasmine.createSpy('fail'),
            args = {};

        spyOn(device, "getDeviceInfo");

        manager.exec(win, fail, "Device", "getDeviceInfo", args);
        expect(device.getDeviceInfo).toHaveBeenCalledWith(args, win, fail);
    });

    it("returns the result of the plugin", function () {
        var camera = require('cordova/plugin/qnx/camera');
        spyOn(camera, "takePicture").andReturn("duckface");
        expect(manager.exec(null, null, "Camera", "takePicture")).toBe("duckface");
    });

    it("returns class not found when no plugin", function () {
        expect(manager.exec(null, null, "Ruby", "method_missing")).toEqual({
           status: cordova.callbackStatus.CLASS_NOT_FOUND_EXCEPTION,
           message: "Class Ruby cannot be found"
        });
    });

    it("returns invalid action when no action", function () {
        expect(manager.exec(null, null, "Camera", "makePonies")).toEqual({
            status: cordova.callbackStatus.INVALID_ACTION,
            message: "Action not found: makePonies"
        });
    });
});
