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

describe("blackberry exec", function () {
    var exec = require('cordova/blackberryexec'),
        cordova = require('cordova');

    it("calls the managers exec for the given runtime", function () {
        var platform = require('cordova/platform'),
            manager = require('cordova/plugin/air/manager'),
            win = jasmine.createSpy("win"),
            fail = jasmine.createSpy("fail"),
            args = {};

        spyOn(platform, "runtime").andReturn("air");
        spyOn(manager, "exec");

        exec(win, fail, "foo", "bar", args);

        expect(manager.exec).toHaveBeenCalledWith(win, fail, "foo", "bar", args);
    });

    describe("when the callback status is ok", function () {
        var platform = require('cordova/platform'),
            manager = require('cordova/plugin/air/manager');

        beforeEach(function () {
            spyOn(platform, "runtime").andReturn("air");
            spyOn(manager, "exec").andReturn({
                status: cordova.callbackStatus.OK,
                message: "sometimes I drink from the milk carton"
            });
        });

        it("returns the message", function () {
            expect(exec(null, null)).toBe("sometimes I drink from the milk carton");
        });

        it("calls the success callback with the message", function () {
            var success = jasmine.createSpy("success");
            exec(success);
            expect(success).toHaveBeenCalledWith("sometimes I drink from the milk carton");
        });

        it("doesn't call the error callback", function () {
            var error = jasmine.createSpy("error");
            exec(null, error);
            expect(error).not.toHaveBeenCalled();
        });

        it("logs any errors from the success callback", function () {
            spyOn(console, "log");

            var success = jasmine.createSpy("success").andThrow("oh noes!");
            cordova.callbackId = 1;
            exec(success);

            expect(console.log).toHaveBeenCalledWith("Error in success callback: 1 = oh noes!");
        });

        it("still returns the message even if there was an exception in success", function () {
            spyOn(console, "log");
            var success = jasmine.createSpy("success").andThrow("oh noes!");
            expect(exec(success)).toBe("sometimes I drink from the milk carton");
        });
    });

    describe("when the callback status is no_result", function () {
        var platform = require('cordova/platform'),
            manager = require('cordova/plugin/air/manager');

        beforeEach(function () {
            spyOn(platform, "runtime").andReturn("air");
            spyOn(manager, "exec").andReturn({
                status: cordova.callbackStatus.NO_RESULT,
                message: "I know what you did last summer"
            });
        });

        it("returns undefined", function () {
            expect(exec()).not.toBeDefined();
        });

        it("doesn't call the success callback", function () {
            var success = jasmine.createSpy("success");
            exec(success);
            expect(success).not.toHaveBeenCalled();
        });

        it("doesn't call the error callback", function () {
            var error = jasmine.createSpy("error");
            exec(null, error);
            expect(error).not.toHaveBeenCalled();
        });
    });

    describe("when the callback status is anything else", function () {
        var platform = require('cordova/platform'),
            manager = require('cordova/plugin/air/manager');

        beforeEach(function () {
            spyOn(console, "log");
            spyOn(platform, "runtime").andReturn("air");
            spyOn(manager, "exec").andReturn({
                status: "poop",
                message: "the bed"
            });
        });

        it("returns null", function () {
            expect(exec()).toBeNull();
        });

        it("logs the status and message", function () {
            exec();
            expect(console.log).toHaveBeenCalledWith("Error: Status=poop Message=the bed");
        });

        it("calls the fail callback with the message", function () {
            var fail = jasmine.createSpy("fail");
            exec(null, fail);
            expect(fail).toHaveBeenCalledWith("the bed");
        });

        it("doesn't call the success callback", function () {
            var success = jasmine.createSpy("success");
            exec(success);
            expect(success).not.toHaveBeenCalled();
        });

        it("logs the exception from the error callback", function () {
            var error = jasmine.createSpy("error").andThrow("aww snap");
            cordova.callbackId = 1;
            exec(null, error);

            expect(console.log).toHaveBeenCalledWith("Error in error callback: 1 = aww snap");
        });

        it("still returns null when there is an error", function () {
            var error = jasmine.createSpy("error").andThrow("aww snap");
            expect(exec(null, error)).toBeNull();
        });
    });
});
