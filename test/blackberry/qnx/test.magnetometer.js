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

describe("blackberry qnx magnetometer", function () {
    var magnetometer = require('cordova/plugin/qnx/magnetometer'),
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
            expect(window.removeEventListener).toHaveBeenCalled();
        });

        it('should add an event listener', function(){
            magnetometer.start();
            expect(window.addEventListener).toHaveBeenCalled();
        });

        it('should grab the magnetometer', function(){
            var win = jasmine.createSpy('win');
            magnetometer.start({}, win);

            window.addEventListener.mostRecentCall.args[1]({
                alpha: 0,
                timeStamp: "bout that time, eh chap?"
            });

            expect(win).toHaveBeenCalledWith({
                magneticHeading: 360,
                trueHeading: 360,
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
            expect(window.removeEventListener).toHaveBeenCalled();
        });
    });
    
});
