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

describe("accelerometer", function () {
    var accelerometer = require('cordova/plugin/webworks/accelerometer'),
        cordova = require('cordova');

    beforeEach(function(){
        spyOn(window, "removeEventListener");
        spyOn(window, "addEventListener");
    });

    describe("start", function() {
        it("returns no result", function () {
            expect(accelerometer.start()).toEqual({
                status: cordova.callbackStatus.NO_RESULT,
                message: "WebWorks Is On It"
            });
        });

        it("removes the event listener", function () {
            accelerometer.start();
            expect(window.removeEventListener).toHaveBeenCalledWith("devicemotion", jasmine.any(Function));
        });

        it("adds the event listener back", function () {
            accelerometer.start();
            expect(window.addEventListener).toHaveBeenCalledWith("devicemotion", jasmine.any(Function));
        });

        it("grabs the motion information from the callback and calls success", function () {
            var success = jasmine.createSpy("success");
            accelerometer.start({}, success);

            window.addEventListener.mostRecentCall.args[1]({
                accelerationIncludingGravity: {
                    x: 1,
                    y: 2,
                    z: 3,
                },
                timestamp: "around tea time"
            });

            expect(success).toHaveBeenCalledWith({
                x: 1,
                y: 2,
                z: 3,
                timestamp: "around tea time"
            });
        });
    });

    describe("stop", function() {
        it("returns OK", function () {
            expect(accelerometer.stop()).toEqual({
                status: cordova.callbackStatus.OK,
                message: "removed"
            });
        });

        it("removes the event listener", function () {
            accelerometer.stop();
            expect(window.removeEventListener).toHaveBeenCalledWith("devicemotion", jasmine.any(Function));
        });
    });
});
