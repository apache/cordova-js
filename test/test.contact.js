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

describe("Contact", function () {
    var Contact = require('cordova/plugin/Contact'),
        exec = require('cordova/exec');


    describe("ctor", function () {
        it("sets the default values", function () {
            var c = new Contact();

            expect(c.id).toBe(null);
            expect(c.rawId).toBe(null);
            expect(c.displayName).toBe(null);
            expect(c.name).toBe(null);
            expect(c.nickname).toBe(null);
            expect(c.phoneNumbers).toEqual(null);
            expect(c.emails).toEqual(null);
            expect(c.addresses).toEqual(null);
            expect(c.ims).toEqual(null);
            expect(c.organizations).toEqual(null);
            expect(c.birthday).toBe(null);
            expect(c.note).toBe(null);
            expect(c.photos).toEqual(null);
            expect(c.categories).toEqual(null);
            expect(c.urls).toEqual(null);
        });

        it("overrides default values with the arguments", function () {
            var c = new Contact(
                1,
                "Bart",
                "Bartholomew JoJo Simpson",
                "Bart",
                ["KL5-3223"],
                ["bart@but.com"],
                ["742 Evergreen Terrace, Springfield USA"],
                ["1234567"],
                ["Springfield Elementary"],
                new Date("April 1, 1979"),
                "Everybody in the house do the Bartman",
                ["http://upload.wikimedia.org/wikipedia/en/thumb/e/ed/Bart_Simpson.svg/200px-Bart_Simpson.svg.png"],
                ["simpson", "child"],
                ["www.thesimpsons.com"]
            );

            expect(c.id).toBe(1);
            expect(c.rawId).toBe(null);
            expect(c.displayName).toBe("Bart");
            expect(c.name).toBe("Bartholomew JoJo Simpson");
            expect(c.nickname).toBe("Bart");
            expect(c.phoneNumbers).toEqual(["KL5-3223"]);
            expect(c.emails).toEqual(["bart@but.com"]);
            expect(c.addresses).toEqual(["742 Evergreen Terrace, Springfield USA"]);
            expect(c.ims).toEqual(["1234567"]);
            expect(c.organizations).toEqual(["Springfield Elementary"]);
            expect(c.birthday).toEqual(new Date("April 1, 1979")),
            expect(c.note).toBe("Everybody in the house do the Bartman");
            expect(c.photos).toEqual(["http://upload.wikimedia.org/wikipedia/en/thumb/e/ed/Bart_Simpson.svg/200px-Bart_Simpson.svg.png"]);
            expect(c.categories).toEqual(["simpson", "child"]);
            expect(c.urls).toEqual(["www.thesimpsons.com"]);
        });
    });

    describe("clone", function () {
        it("clears the id's on the cloned contact", function () {

            var c = new Contact();
            c.id = 1;
            c.rawId = 1;

            c.phoneNumbers = [{id: 1}];
            c.emails = [{id: 1}];
            c.addresses = [{id: 1}];
            c.ims = [{id: 1}];
            c.organizations = [{id: 1}];
            c.categories = [{id: 1}];
            c.photos = [{id: 1}];
            c.urls = [{id: 1}];

            var clone = c.clone();

            expect(clone.id).toBeNull();
            expect(clone.rawId).toBeNull();
            expect(clone.phoneNumbers[0].id).toBeNull();
            expect(clone.emails[0].id).toBeNull();
            expect(clone.addresses[0].id).toBeNull();
            expect(clone.ims[0].id).toBeNull();
            expect(clone.organizations[0].id).toBeNull();
            expect(clone.categories[0].id).toBeNull();
            expect(clone.photos[0].id).toBeNull();
            expect(clone.urls[0].id).toBeNull();
        });
    });

    describe("save", function () {
        it("calls exec when saving", function () {
            var c = new Contact(),
                s = jasmine.createSpy(),
                e = jasmine.createSpy();

            c.save(s, e);
            expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Contacts", "save", [c]);
        });
    });
});
