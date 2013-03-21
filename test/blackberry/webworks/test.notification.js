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

describe("notification", function () {
    var notification = require('cordova/plugin/webworks/notification'),
        cordova = require('cordova'),
        platform = require('cordova/platform');

    beforeEach(function(){
        global.blackberry = {
            ui:{
                dialog:{
                    customAskAsync: jasmine.createSpy(),
                    standardAskAsync: jasmine.createSpy(),
                    D_PROMPT: jasmine.createSpy(),
                }
            }
        }
    });

    afterEach(function(){
        delete global.blackberry;
    });

    describe("alert", function() {

        it("should return that alert arguments are missing", function() {
            expect(notification.alert("")).toEqual({
                status: 9,
                message: "Notification action - alert arguments not found"
            });
        });

        it("should call the blackberry object", function() {
            var win = jasmine.createSpy('win'); 
            notification.alert(["Danger, danger Will Robinson!", "Panic, is my middle name", "PANIC!"], win);
            expect(blackberry.ui.dialog.customAskAsync).toHaveBeenCalledWith("Danger, danger Will Robinson!", [ "PANIC!" ], win, { "title" : "Panic, is my middle name" });
        });
        
        it("should return that WebWorks Is On It", function() {
            expect(notification.alert(["Danger, danger Will Robinson!", "Panic, is my middle name", "PANIC!"])).toEqual({
                status: cordova.callbackStatus.NO_RESULT,
                message: "WebWorks Is On It"
            });
        });
    });

    describe("confirm", function() {
        it("should return that alert arguments are missing", function() {
            expect(notification.confirm("")).toEqual({
                status: 9,
                message: "Notification action - confirm arguments not found"
            });
        });

        it("should call the blackberry object", function() {
            var win = jasmine.createSpy('win'); 
            notification.confirm(["Are you interested in cheaper long distance?", "Serving you better!", "SCREAM,CONFIRM"], win);

            expect(blackberry.ui.dialog.customAskAsync).toHaveBeenCalledWith("Are you interested in cheaper long distance?", [ "SCREAM", "CONFIRM" ], win, { "title" : "Serving you better!" });
        });
        
        it("should return that WebWorks Is On It", function() {
            expect(notification.confirm(["Danger, danger Will Robinson!", "Panic, is my middle name", "PANIC!"])).toEqual({
                status: cordova.callbackStatus.NO_RESULT,
                message: "WebWorks Is On It"
            });
        });
    });

    describe("prompt", function() {

        var runtime;

        beforeEach(function () {
            runtime = "qnx";
            spyOn(platform, "runtime").andCallFake(function () {
                return runtime;
            });
        });

        it("should return that prompt arguments are missing", function () {
            expect(notification.prompt("")).toEqual({
                status: 9,
                message: "Notification action - prompt arguments not found"
            });
        });

        it("should return that WebWorks Is On It", function () {
            expect(notification.prompt(["Message", "Title", []], function () {})).toEqual({
                status: cordova.callbackStatus.NO_RESULT,
                message: "WebWorks Is On It"
            });
        });

        it("should return that runtime is not supported", function () {
            runtime = "java";
            expect(notification.prompt(["Message", "Title", []], function () {})).toEqual({
                status: 9,
                message: "Notification action - runtime not supported"
            });
        });

        it("should call the blackberry object", function() {
            notification.prompt(["Message", "Title", []], function () {});

            expect(blackberry.ui.dialog.standardAskAsync).toHaveBeenCalledWith(
                "Message", 
                blackberry.ui.dialog.D_PROMPT, 
                jasmine.any(Function), 
                { "title" : "Title" });
        });

        it("should invoke callback with result object for Ok", function() {
            var win = jasmine.createSpy('win');

            blackberry.ui.dialog.standardAskAsync.andCallFake(function (a, b, callback) {
                callback({"return": "Ok", promptText: "Hello"});
            });

            notification.prompt(["Message", "Title", []], win);

            expect(win).toHaveBeenCalledWith({buttonIndex: 0 , input1: "Hello"});
        });

        it("should invoke callback with result object for Cancel", function() {
            var win = jasmine.createSpy('win');

            blackberry.ui.dialog.standardAskAsync.andCallFake(function (a, b, callback) {
                callback({"return": "Cancel"});
            });

            notification.prompt(["Message", "Title", []], win);

            expect(win).toHaveBeenCalledWith({buttonIndex: 1});
        });
    });

});
