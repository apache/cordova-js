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
        cordova = require('cordova');

    beforeEach(function(){
        global.blackberry = {
            ui:{
                dialog:{
                    customAskAsync: jasmine.createSpy()
                        // apply: jasmine.createSpy('apply')

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
            notification.confirm(["Are you interested in cheaper long distance?", "Serving you better!", ["SCREAM", "CONFIRM"]], win);

            expect(blackberry.ui.dialog.customAskAsync).toHaveBeenCalledWith("Are you interested in cheaper long distance?", [ "SCREAM", "CONFIRM" ], win, { "title" : "Serving you better!" });
        });

        it("should return that WebWorks Is On It", function() {
            expect(notification.confirm(["Danger, danger Will Robinson!", "Panic, is my middle name", "PANIC!"])).toEqual({
                status: cordova.callbackStatus.NO_RESULT,
                message: "WebWorks Is On It"
            });
        });
    });

});
