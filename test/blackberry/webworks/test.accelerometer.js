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
    var accelerometer = require('cordova/plugin/webworks/accelerometer');

    describe("start", function() {
        it("should start webworks watching the accelerometer", function() {            
            spyOn(window, "removeEventListener");
            spyOn(window, "addEventListener");

            var callback = function(motion){},
                win = function(){},
                fail = function(){},
                args = {x:1,y:2,z:3},
                aStart = accelerometer.start(args, win, fail);

            expect(window.removeEventListener).toHaveBeenCalledWith("devicemotion", undefined);

            expect(window.addEventListener).toHaveBeenCalledWith("devicemotion", jasmine.any(Function));

            window.removeEventListener.reset();
            window.addEventListener.reset();
        	
            expect(aStart.status).toBe(0);
        	expect(aStart.message).toBe('WebWorks Is On It');

        });
    });

    describe("stop", function() {
        it("should stop webworks from watching the accelerometer", function() {            
            spyOn(window, "removeEventListener");
            var aStop = accelerometer.stop();

            expect(window.removeEventListener).toHaveBeenCalled();
        	expect(aStop.status).toBe(0);
        	expect(aStop.message).toBe('WebWorks Is On It');

        });
    });

});

