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

describe("blackberry qnx camera", function () {
    var camera = require('cordova/plugin/qnx/camera'),
        cordova = require('cordova');

    beforeEach(function () {
        global.blackberry = {
            invoke: {
                card: {
                    invokeCamera: jasmine.createSpy("invokeCamera")
                }
            }
        };
    });

    afterEach(function () {
        delete global.blackberry;
    });
    
    it("returns no_result when calling takePicture", function () {
        expect(camera.takePicture()).toEqual({
            status: cordova.callbackStatus.NO_RESULT,
            message: "WebWorks Is On It"
        });
    });

    it("calls blackberry.invoke.card.invokeCamera", function () {
        camera.takePicture();
        expect(blackberry.invoke.card.invokeCamera).toHaveBeenCalledWith("photo", jasmine.any(Function), jasmine.any(Function), jasmine.any(Function));
    });

    it("adds file:// to the path provided to the callback and calls success", function () {
        var win = jasmine.createSpy("win");
        camera.takePicture({}, win);

        blackberry.invoke.card.invokeCamera.mostRecentCall.args[1]("pics/ponies.jpg");
        expect(win).toHaveBeenCalledWith("file://pics/ponies.jpg");
    });
});
