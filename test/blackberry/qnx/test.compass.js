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

xdescribe("blackberry qnx compass", function () {
    var compass = require('cordova/plugin/qnx/compass'),
        cordova = require('cordova'),
        exec = require('cordova/exec'),
        utils = require('cordova/utils'),
        CompassHeading = require('cordova/plugin/CompassHeading'),
        CompassError = require('cordova/plugin/CompassError'),
        win = jasmine.createSpy('win'),
        fail = jasmine.createSpy('fail');

    beforeEach(function () {
        window.start = jasmine.createSpy('start');
        window.stop = jasmine.createSpy('stop');
        window.removeListeners = jasmine.createSpy('removeListeners');
        global.listeners = [];

    });

    afterEach(function () {

    });


    describe("watchHeading", function(){
        it('should return that successCallback is not a function', function(){
            expect(compass.getCurrentHeading).toThrow("getCurrentHeading must be called with at least a success callback function as first parameter.");
        });

        it('should see that start() was called', function(){
            compass.getCurrentHeading(win, fail);
            expect(listeners).toHaveBeenCalled();
        });

    });

    describe("clearWatch", function(){


    });
});
