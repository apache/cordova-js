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

var app,
    io,
    filetransfer,
    system,
    builder,
    utils;

describe("blackberry10 builder", function () {

    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock
        window.webworks = {
            webworks: {
                execSync: jasmine.createSpy(),
                defineReadOnlyField: jasmine.createSpy()
            }
        };

        app = {
            "name": "abc",
            "version": "1.2.3"
        };
        io = {
            "sandbox": false
        };
        filetransfer = {
            "upload": function () {},
            "download": function () {}
        };
        system =  {
            "getCurrentTimezone": function () {}
        };

        utils = require("cordova/plugin/blackberry10/utils");
        spyOn(utils, "loadModule").andCallFake(function (module) {
            if (module.indexOf("app") !== -1) {
                return app;
            } else if (module.indexOf("filetransfer") !== -1) {
                return filetransfer;
            } else if (module.indexOf("io") !== -1) {
                return io;
            } else if (module.indexOf("system") !== -1) {
                return system;
            }
        });

        builder = require("cordova/plugin/blackberry10/builder");
    });

    afterEach(function () {
        delete window.webworks;
        builder = null;
    });

    it("can build an object with a single member", function () {
        var featureIds = ['blackberry.app'],
            target = {};

        builder.build(featureIds).into(target);

        expect(target.blackberry.app).toEqual(app);
        expect(Object.hasOwnProperty.call(target.blackberry.app, "name")).toBeTruthy();
        expect(Object.hasOwnProperty.call(target.blackberry.app, "version")).toBeTruthy();
    });

    it("can build an object with a nested member", function () {
        var featureIds = ['blackberry.io', 'blackberry.io.filetransfer'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.io.filetransfer).toEqual(filetransfer);
        expect(target.blackberry.io.sandbox).toEqual(io.sandbox);
    });

    it("can build with feature IDs provided in any order", function () {
        var featureIds = ['blackberry.io.filetransfer', 'blackberry.io'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.io.filetransfer).toEqual(filetransfer);
        expect(target.blackberry.io.sandbox).toEqual(io.sandbox);
    });

    it("can build an object with only the nested member", function () {
        var featureIds = ['blackberry.io.filetransfer'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.io.filetransfer).toEqual(filetransfer);
    });

    it("can build an object with multiple members", function () {
        var featureIds = ['blackberry.app', 'blackberry.system'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.app).toEqual(app);
        expect(target.blackberry.system).toEqual(system);
    });
});
