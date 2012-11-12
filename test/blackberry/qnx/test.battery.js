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

describe("blackberry qnx battery", function () {
    var battery = require('cordova/plugin/qnx/battery'),
        cordova = require('cordova');

    beforeEach(function () {
        spyOn(window, "setInterval").andReturn(1);
        spyOn(window, "clearInterval");
    });

    it("returns no_result when calling start", function () {
        expect(battery.start()).toEqual({
            status: cordova.callbackStatus.NO_RESULT,
            message: "WebWorks Is On It"
        });
    });

    it("sets an interval for 500 ms when calling start", function () {
        battery.start();
        expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 500);
    });

    it("calls the win callback with values from navigator.webkitBattery", function () {
        global.navigator = window.navigator;
        window.navigator.webkitBattery = { level: 0.12, charging: true };

        var win = jasmine.createSpy("win");
        battery.start({}, win);

        window.setInterval.mostRecentCall.args[0]();

        expect(win).toHaveBeenCalledWith({
            level: 12,
            isPlugged: true
        });

        delete window.navigator.webkitBattery;
    });

    it("returns ok when calling stop", function () {
        expect(battery.stop()).toEqual({
            status: cordova.callbackStatus.OK,
            message: "stopped"
        });
    });

    it("calls clearInterval when stopping", function () {
        battery.start();
        battery.stop();
        expect(window.clearInterval).toHaveBeenCalledWith(1);
    });
});
