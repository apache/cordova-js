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
    var notification = require('cordova/plugin/notification'),
        exec = require('cordova/exec');

    describe("when alerting", function () {
        it("defaults the title to Alert and the button to OK", function () {
            notification.alert("u can't touch this");
            expect(exec).toHaveBeenCalledWith(
                undefined, null, "Notification", "alert",
                ["u can't touch this", "Alert", "OK"]);
        });

        it("passes the provided params to the exec method", function () {
            var cb = jasmine.createSpy();
            notification.alert("hammertime", cb, "STOP!", "GO");
            expect(exec).toHaveBeenCalledWith(
                cb, null, "Notification", "alert", 
                ["hammertime", "STOP!", "GO"]);
        });
    });

    describe("when confirming", function () {
        it("defaults the title to Confirm and the buttons to OK,Cancel", function () {
            notification.confirm("hahh shhh push it?");
            expect(exec).toHaveBeenCalledWith(
                undefined, null, "Notification", "confirm",
                ["hahh shhh push it?", "Confirm", "OK,Cancel"]);
        });

        it("passes the provided params to the exec method", function () {
            var cb = jasmine.createSpy();
            notification.confirm("and thats the way it is", cb, "It's like that", ["Yes", "Yes"]);
            expect(exec).toHaveBeenCalledWith(
                cb, null, "Notification", "confirm",
                ["and thats the way it is", "It's like that", "Yes,Yes"]);
        });
    });

    describe("when prompting", function () {
        it("defaults the title to Prompt, the message to Prompt message and the buttons to OK,Cancel", function () {
            notification.prompt();
            expect(exec).toHaveBeenCalledWith(
                undefined, null, "Notification", "prompt",
                ["Prompt message", "Prompt", ['OK','Cancel']]);
        });

        it("passes the provided params to the exec method", function () {
            var cb = jasmine.createSpy();
            notification.prompt("baby prompt me one more time!", cb, "oh baby baby", ["Yes", "No"]);
            expect(exec).toHaveBeenCalledWith(
                cb, null, "Notification", "prompt", 
                ["baby prompt me one more time!", "oh baby baby", ['Yes','No']]);
        });
    });

    it("causes the device to vibrate", function () {
        notification.vibrate(1000);
        expect(exec).toHaveBeenCalledWith(
            null, null, "Notification", "vibrate", [1000]);
    });

    it("causes the device to beep", function () {
        notification.beep(9001);
        //It's over 9000!
        expect(exec).toHaveBeenCalledWith(
            null, null, "Notification", "beep", [9001]);
    });
});
