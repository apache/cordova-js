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
        exec = require('cordova/exec');

    // alerts handled by cordova
    describe("alert - arguments not equal to three", function() {
        it("should provide an alert notification", function() {            

            var args = "Danger, danger Will Robinson!",
                n = notification.alert(args);

            expect(args.length).not.toBe(3);
        	expect(n.status).toBe(9);
        	expect(n.message).toBe('Notification action - alert arguments not found');
        });
    });

    // alerts handled by webworks
    describe("alert - arguments equal to three", function() {
        it("should call blackberry.ui.dialog.customAskAsync", function() {  

            // spyOn(blackberry.ui.dialog.customAskAsync, "apply");
            
            // var args = ["Danger, danger Will Robinson", "Panic, is my middle name", "PANIC"],
            // n = notification.alert(args);


            // expect(args.length).toBe(3);
            // expect(n.status).toBe(9);
            // expect(n.message).toBe('Notification action - alert arguments not found');

        });
    });

    // confirm handled by cordova
    describe("confirm - arguments not equal to three", function() {
        it("should provide a confirm notification", function() {            

            var args = "Are you sure you're ready to jump?",
                n = notification.confirm(args);

            expect(args.length).not.toBe(3);
            expect(n.status).toBe(9);
            expect(n.message).toBe('Notification action - confirm arguments not found');
        });
    });

    // confirm handled by webworks
    describe("alert - arguments equal to three", function() {
        it("should call blackberry", function() {            
        
        // var args = ["Danger, danger Will Robinson", "Panic, is my middle name", "PANIC"];
        // var n = notification.alert(args); 
        // TALK TO GORD!!!!!

        });
    });

});
