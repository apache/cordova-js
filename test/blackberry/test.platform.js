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

describe("blackberry platform", function () {
    var platform = require('cordova/blackberryplatform');

    describe("when getting the runtime", function () {
        beforeEach(function () {
            global.blackberry = {
                system: {
                    softwareVersion: ""
                }
            };
        });

        afterEach(function () {
            delete global.blackberry;
        });

        it("returns qnx if webworks exists on window", function () {
            window.webworks = {};
            expect(platform.runtime()).toBe("qnx");
            delete window.webworks;
        });

        it("returns air if softwareVersion starts with BlackBerry", function () {
            blackberry.system.softwareVersion = "BlackBerry PlayBook OS"
            expect(platform.runtime()).toBe("air");
        });

        it("returns java if software version is anything else", function () {
            blackberry.system.softwareVersion = "7.0"
            expect(platform.runtime()).toBe("java");
        });
    });

    describe("when initializing", function () {
        var builder = require('cordova/builder'),
            clobber = jasmine.createSpy("intoAndClobber"),
            merge = jasmine.createSpy("intoAndMerge");

        beforeEach(function () {
            spyOn(builder, "build").andReturn({
                intoAndClobber: clobber,
                intoAndMerge: merge
            });
        });

        it("calls initialize for the platform from the runtime", function () {
            var air = require('cordova/plugin/air/platform');

            spyOn(air, "initialize");
            spyOn(platform, "runtime").andReturn("air");

            platform.initialize();

            expect(air.initialize).toHaveBeenCalled();
        });

        it("builds given platforms objects into window and clobbers them", function () {
            var java = require('cordova/plugin/java/platform');

            spyOn(java, "initialize");
            spyOn(platform, "runtime").andReturn("java");

            platform.initialize();

            expect(builder.build).toHaveBeenCalledWith(java.objects);
            expect(clobber).toHaveBeenCalledWith(window);
        });

        it("builds given platforms merges into window and merges them", function () {
            var qnx = require('cordova/plugin/qnx/platform');

            spyOn(qnx, "initialize");
            spyOn(platform, "runtime").andReturn("qnx");

            platform.initialize();

            expect(builder.build).toHaveBeenCalledWith(qnx.merges);
            expect(merge).toHaveBeenCalledWith(window);
        });
    });
});
