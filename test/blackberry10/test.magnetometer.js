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

describe("blackberry10 magnetometer", function () {
    var magnetometer = require('cordova/plugin/blackberry10/magnetometer'),
        cordova = require('cordova');

    beforeEach(function () {
        spyOn(window, "removeEventListener");
        spyOn(window, "addEventListener");
    });

    describe("start", function(){
        it('should return no result', function(){
            expect(magnetometer.start()).toEqual({
                status: cordova.callbackStatus.NO_RESULT,
                message: "WebWorks Is On It"
            });
        });

        it('should remove the event listener', function(){
            magnetometer.start();
            expect(window.removeEventListener).toHaveBeenCalledWith("deviceorientation", jasmine.any(Function));
        });

        it('should add an event listener', function(){
            magnetometer.start();
            expect(window.addEventListener).toHaveBeenCalledWith("deviceorientation", jasmine.any(Function));
        });

        it('call the win callback with the data from the event', function(){
            var win = jasmine.createSpy('win');
            magnetometer.start({}, win);

            window.addEventListener.mostRecentCall.args[1]({
                alpha: 60,
                timeStamp: "bout that time, eh chap?"
            });

            expect(win).toHaveBeenCalledWith({
                magneticHeading: 300,
                trueHeading: 300,
                headingAccuracy: 0,
                timestamp: "bout that time, eh chap?"
            });
        });
    });

    describe('stop', function(){
        it('should return OK', function(){
            expect(magnetometer.stop()).toEqual({
                status: cordova.callbackStatus.OK,
                message: "removed"
            });
        });

        it('should remove the event listener', function(){
            magnetometer.stop();
            expect(window.removeEventListener).toHaveBeenCalledWith("deviceorientation", jasmine.any(Function));
        });
    });
});
