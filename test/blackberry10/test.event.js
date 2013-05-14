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

describe("blackberry10 event", function () {
    var event = require("cordova/plugin/blackberry10/event"),
        _window;

    beforeEach(function () {
        _window = {
            webworks: {
                exec: jasmine.createSpy("window.webworks.exec")
            }
        };
        window.webworks = _window.webworks;
    });

    afterEach(function () {
        delete window.webworks;
    });

    describe("add", function () {

        it("it can call webworks.exec action 'add' given valid featureId, eventName and callback", function () {
            var callback = function () {};
            event.add("blackberry.system.event", "foo", callback);
            expect(_window.webworks.exec).toHaveBeenCalledWith(undefined, undefined, "blackberry.system.event", "add", {"eventName": "foo"});
            event.remove("blackberry.system.event", "foo", callback);
        });

        it("it will not call webworks.exec for multiple callbacks", function () {
            var callback = jasmine.createSpy(),
                callback2 = jasmine.createSpy();
            event.add("blackberry.system.event", "foo", callback);
            event.add("blackberry.system.event", "foo", callback2);
            expect(_window.webworks.exec).toHaveBeenCalledWith(undefined, undefined, "blackberry.system.event", "add", {"eventName": "foo"});
            expect(_window.webworks.exec.callCount).toEqual(1);
            event.remove("blackberry.system.event", "foo", callback);
            event.remove("blackberry.system.event", "foo", callback2);
        });

        it("will not register duplicate callbacks if it is the only registered callback for the event", function () {
            var callback = jasmine.createSpy();
            event.add("blackberry.system.event", "foo", callback);
            event.add("blackberry.system.event", "foo", callback);
            event.trigger("foo", '[{"id": 1}]');
            expect(callback).toHaveBeenCalledWith({"id": 1});
            expect(callback.callCount).toEqual(1);
            event.remove("blackberry.system.event", "foo", callback);
        });

        it("will not register duplicate callbacks if it is not the only registered callback for the event", function () {
            var firstCallback = jasmine.createSpy(),
                secondCallback = jasmine.createSpy(),
                thirdCallback = jasmine.createSpy();

            event.add("blackberry.system.event", "foo", firstCallback);
            event.add("blackberry.system.event", "foo", secondCallback);
            event.add("blackberry.system.event", "foo", thirdCallback);
            event.add("blackberry.system.event", "foo", firstCallback);
            event.trigger("foo", null);
            expect(firstCallback.callCount).toEqual(1);
            event.remove("blackberry.system.event", "foo", firstCallback);
            event.remove("blackberry.system.event", "foo", secondCallback);
            event.remove("blackberry.system.event", "foo", thirdCallback);
        });

        it("will register two distinct callbacks", function () {
            var callback = jasmine.createSpy(),
                callback2 = jasmine.createSpy();
            event.add("blackberry.system.event", "foo", callback);
            event.add("blackberry.system.event", "foo", callback2);
            event.trigger("foo", '[{"id": 1}]');
            expect(callback).toHaveBeenCalledWith({"id": 1});
            expect(callback2).toHaveBeenCalledWith({"id": 1});
            event.remove("blackberry.system.event", "foo", callback);
            event.remove("blackberry.system.event", "foo", callback2);
        });
    });

    describe("once", function () {
        it("will call webworks.exec action 'once' given valid featureId, eventName and callback", function () {
            var callback = function () {};
            event.once("blackberry.system.event", "foo", callback);
            expect(_window.webworks.exec).toHaveBeenCalledWith(undefined, undefined, "event", "once", {"eventName": "foo"});
            event.remove("blackberry.system.event", "foo", callback);
        });
    });

    describe("remove", function () {
        it("can call webworks.exec action 'remove' given valid featureId, eventName and callback", function () {
            var cb = jasmine.createSpy();
            event.add("blackberry.system.event", "a", cb);
            event.remove("blackberry.system.event", "a", cb);
            expect(_window.webworks.exec).toHaveBeenCalledWith(undefined, undefined, "blackberry.system.event", "remove", {"eventName": "a"});
        });
    });

    describe("trigger", function () {
        it("will invoke callback if event has been added", function () {
            var callback = jasmine.createSpy();
            event.add("blackberry.system.event", "foo", callback);
            event.trigger("foo", '[{"id": 1}]');
            expect(callback).toHaveBeenCalledWith({"id": 1});
            event.remove("blackberry.system.event", "foo", callback);
        });

        it("will invoke callback if no args are provided", function () {
            var callback = jasmine.createSpy();
            event.add("blackberry.event", "pause", callback);
            event.trigger("pause");
            expect(callback).toHaveBeenCalled();
            event.remove("blackberry.system.event", "foo", callback);
        });

        it("will invoke callback with multiple args", function () {
            var callback = jasmine.createSpy();
            event.add("blackberry.event", "pause", callback);
            event.trigger("pause", "[1,2,3,4,5]");
            expect(callback).toHaveBeenCalledWith(1, 2, 3, 4, 5);
            event.remove("blackberry.system.event", "foo", callback);
        });

        it("will not invoke callback if event has been removed", function () {
            var cb = jasmine.createSpy();
            event.add("blackberry.system.event", "c", cb);
            event.remove("blackberry.system.event", "c", cb);
            event.trigger("c", {"id": 1});
            expect(cb).not.toHaveBeenCalled();
        });

        it("will remove once listeners after they are triggered", function () {
            var callback = jasmine.createSpy();
            event.once("blackberry.system.event", "foo", callback);
            event.trigger("foo", '[{"id": 1}]');
            event.trigger("foo", '[{"id": 1}]');
            expect(callback).toHaveBeenCalledWith({"id": 1});
            expect(callback.callCount).toEqual(1);
        });

        it("will not remove on listeners after they are triggered", function () {
            var callback = jasmine.createSpy();
            event.add("blackberry.system.event", "foo", callback);
            event.trigger("foo", '[{"id": 1}]');
            event.trigger("foo", '[{"id": 1}]');
            expect(callback).toHaveBeenCalledWith({"id": 1});
            expect(callback.callCount).toEqual(2);
            event.remove("blackberry.system.event", "foo", callback);
        });
    });

    describe("isOn", function () {
        it("returns false with no listeners", function () {
            expect(event.isOn("foo")).toEqual(false);
        });

        it("returns true with listeners", function () {
            var callback = jasmine.createSpy();
            event.add("blackberry.system.event", "foo", callback);
            expect(event.isOn("foo")).toEqual(true);
            event.remove("blackberry.system.event", "foo", callback);
        });

        it("Updates properly once listeners are removed", function () {
            var callback = jasmine.createSpy();
            event.add("blackberry.system.event", "foo", callback);
            event.remove("blackberry.system.event", "foo", callback);
            expect(event.isOn("foo")).toEqual(false);
        });
    });
});
