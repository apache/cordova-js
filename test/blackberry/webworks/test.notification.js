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
    var notification = require('cordova/plugin/webworks/notification');

    beforeEach(function(){
        global.blackberry = {
            ui:{
                dialog:{
                    customAskAsync: {
                        apply: function(args){ return args; }
                    }
                }
            }
        }
    });

    afterEach(function(){
        delete global.blackberry;
    });

    describe("alert - arguments not equal to three", function() {
        it("should provide an alert notification", function() {            

            var args = "Danger, danger Will Robinson!",
                n = notification.alert(args);

            expect(args.length).not.toBe(3);
        	expect(n.status).toBe(9);
        	expect(n.message).toBe('Notification action - alert arguments not found');
        });
    });

    describe("alert - arguments equal to three", function() {
        it("should call a webworks action", function() { 
            
            var n = notification.alert(["Danger, danger Will Robinson", "Panic, is my middle name", "PANIC"]);

            expect(n.status).toBe(0);
            expect(n.message).toBe('WebWorks Is On It');

        });
    });

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
        it("should call a webworks action", function() {            
        
            var n = notification.confirm(["Danger, danger Will Robinson", "Panic, is my middle name", "PANIC"]);
            
            expect(n.status).toBe(0);
            expect(n.message).toBe('WebWorks Is On It');

        });
    });

});
