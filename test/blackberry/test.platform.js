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
        it("returns qnx for the bb10 user agent", function () {
            navigator.__defineGetter__("userAgent", function () {
               return "Mozilla/5.0 (BB10; Touch) AppleWebKit/537.1+ (KHTML, like Gecko) Version/10.0.0.1337 Mobile Safari/537.1+";
            });
            expect(platform.runtime()).toBe("qnx");
        });

        it("returns air for the playbook user agent", function () {
            navigator.__defineGetter__("userAgent", function () {
               return "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML, like Gecko) Version/7.2.1.0 Safari/536.2+";
            });
            expect(platform.runtime()).toBe("air");
        });

        it("returns java for a blackberry user agent", function () {
            navigator.__defineGetter__("userAgent", function () {
               return "Mozilla/5.0 (BlackBerry; U; BlackBerry 9100; en) AppleWebKit/534.3+ (KHTML, like Gecko) Version/6.0.0.286 Mobile Safari/534.3+";
            });
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
