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

describe("contacts", function () {
    var contacts = require('cordova/plugin/contacts'),
        exec = require('cordova/exec'),
        Contact = require('cordova/plugin/Contact'),
        ContactError = require('cordova/plugin/ContactError');

    afterEach(function() {
        exec.reset();
    });

    describe("create", function () {
        it("returns a new contact", function () {
            expect(contacts.create() instanceof Contact).toBe(true);
        });

        it("will copy over properties that are set in the arguments", function () {
            var c = contacts.create({
                name: "Gord Tanner",
                note: "he moved the cheese"
            });

            expect(c.name).toBe("Gord Tanner");
            expect(c.note).toBe("he moved the cheese");
        });

        it("will not copy over properties that don't exist in the Contact object", function () {
            var c = contacts.create({
                isAwesome: "probably"
            });

            expect(c.isAwesome).not.toBeDefined();
        });
    });

    describe("find", function () {
        it("throws an error with no success callback", function () {
            expect(function() {contacts.find()}).toThrow();
        });

        it("doesn't call exec with null fields", function () {
            expect(function() {contacts.find(null, jasmine.createSpy())}).toThrow();
        });

        it("calls the error callback when no fields provided", function () {
            var success = jasmine.createSpy(),
                error = jasmine.createSpy();

            contacts.find([], success, error);
            expect(exec).not.toHaveBeenCalled();
            expect(error).toHaveBeenCalledWith(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
        });

        it("calls exec", function () {
            //http://www.imdb.com/title/tt0181536/
            var success = jasmine.createSpy(),
                error = jasmine.createSpy(),
                fields = ['*'],
                options = {};

            contacts.find(fields, success, error, options);
            expect(exec).toHaveBeenCalledWith(jasmine.any(Function), error, "Contacts", "search", [fields, options]);
            //HACK: I am not expecting to have our success function passed in as there is some stuff done clientside
            expect(exec).not.toHaveBeenCalledWith(success, error, "Contacts", "search", [fields, options]);
        });

        it("creates a contact for each value returned", function () {
            //http://www.imdb.com/title/tt0266543/
            var success = jasmine.createSpy(),
                error = jasmine.createSpy(),
                fields = ['*'],
                options = {};

            spyOn(contacts, "create");
            contacts.find(fields, success, error, options);
            //exec the success callback
            exec.mostRecentCall.args[0]([{
                name: "Nemo",
                note: "He has a lucky fin"
            },
            {
                name: "Nemo",
                note: "He is also a clownfish"
            }]);

            expect(contacts.create.callCount).toBe(2);
            expect(contacts.create).toHaveBeenCalledWith({
                name: "Nemo",
                note: "He has a lucky fin"
            });
            expect(contacts.create).toHaveBeenCalledWith({
                name: "Nemo",
                note: "He is also a clownfish"
            });
        });

        it("calls the success callback on success", function () {
            //http://www.imdb.com/title/tt0889134/
            var success = jasmine.createSpy(),
                error = jasmine.createSpy(),
                fields = ['*'],
                options = {};

            spyOn(contacts, "create").andReturn("Rehab");
            contacts.find(fields, success, error, options);
            //exec the success callback
            exec.mostRecentCall.args[0]([0, 0, 0]);
            expect(success).toHaveBeenCalledWith(["Rehab", "Rehab", "Rehab"]);
        });
    });
});
