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

describe("blackberry10 capture", function () {
    var capture = require('cordova/plugin/blackberry10/capture'),
        cordova = require('cordova');

    describe("getSupportedAudioModes", function(){
        it('should return Ok', function(){
            expect(capture.getSupportedAudioModes()).toEqual({
                status: cordova.callbackStatus.OK,
                message: []
            });
        });
    });

    describe("getSupportedImageModes", function(){
        it('should return Ok', function(){
            expect(capture.getSupportedImageModes()).toEqual({
                status: cordova.callbackStatus.OK,
                message: []
            });
        });
    });

    describe("getSupportedVideoModes", function(){
        it('should return Ok', function(){
            expect(capture.getSupportedVideoModes()).toEqual({
                status: cordova.callbackStatus.OK,
                message: []
            });
        });
    });

    function testCapture(method, action) {
        describe(method, function(){
            beforeEach(function () {
                global.blackberry = {
                    invoke: {
                        card: {
                            invokeCamera: jasmine.createSpy('blackberry.invoke.card.invokeCamera')
                        }
                    }
                };
            });

            afterEach(function () {
                delete global.blackberry;
            });

            it('should return No Result', function(){
                var args = [{limit: 0}],
                    win = jasmine.createSpy('win'),
                    fail = jasmine.createSpy('fail');

                expect(capture[method](args, win, fail)).toEqual({
                    status: cordova.callbackStatus.NO_RESULT,
                    message: "WebWorks Is On It"
                });
            });

            describe("when the limit is 0 or less", function () {
                it('calls the win callback with an empty array', function(){
                    var args = [{ limit: -9 }],
                        win = jasmine.createSpy('win'),
                        fail = jasmine.createSpy('fail');

                    capture[method](args, win, fail);
                    expect(win).toHaveBeenCalled();
                });
            });

            describe("when the limit is greater than 0", function () {
                var win, fail;

                beforeEach(function () {
                    win = jasmine.createSpy("win");
                    fail = jasmine.createSpy("fail");
                });

                it("calls the invokeCamera method", function () {
                    capture[method]([{limit: 1}], win, fail);
                    expect(blackberry.invoke.card.invokeCamera).toHaveBeenCalledWith(action, 
                                                                                     jasmine.any(Function),
                                                                                     jasmine.any(Function),
                                                                                     jasmine.any(Function));
                });

                describe("inside the invokeCamera callback", function () {
                    var onsave;

                    beforeEach(function () {
                        window.webkitRequestFileSystem = jasmine.createSpy("window.webkitRequestFileSystem");
                        global.blackberry.io = { sandbox: true };

                        capture[method]([{limit: 1}], win, fail);
                        onsave = blackberry.invoke.card.invokeCamera.mostRecentCall.args[1];
                    });

                    afterEach(function () {
                        delete window.webkitRequestFileSystem;
                    });

                    it("sets the sandbox to false", function () {
                        onsave();
                        expect(blackberry.io.sandbox).toBe(false);
                    });

                    it("calls webkitRequestFileSystem", function () {
                        onsave();
                        expect(window.webkitRequestFileSystem).toHaveBeenCalledWith(
                            window.PERSISTENT, 
                            1024, 
                            jasmine.any(Function), 
                            fail);
                    });

                    describe("in the webkitRequestFileSystem callback", function () {
                        var callback,
                            fs = { root: { getFile: jasmine.createSpy("getFile") } };

                        beforeEach(function () {
                            onsave('/foo/bar/baz.gif');
                            callback = window.webkitRequestFileSystem.mostRecentCall.args[2];
                        });

                        it("calls getfile on the provided filesystem", function () {
                            callback(fs);
                            expect(fs.root.getFile).toHaveBeenCalledWith('/foo/bar/baz.gif', 
                                                                         {},
                                                                         jasmine.any(Function), 
                                                                         fail);
                        });

                        it("calls the file method of the fileEntity", function () {
                            var fe = { file: jasmine.createSpy('file') };
                            callback(fs);
                            fs.root.getFile.mostRecentCall.args[2](fe);
                            expect(fe.file).toHaveBeenCalledWith(jasmine.any(Function), fail);
                        });

                        describe("in the file callback", function () {
                            var fe = { 
                                    file: jasmine.createSpy('file'),
                                    fullPath: 'file://this/is/the/full/path/eh.png'
                                },
                                fileCB;

                            beforeEach(function () {
                                callback(fs);
                                fs.root.getFile.mostRecentCall.args[2](fe);
                                fileCB = fe.file.mostRecentCall.args[0];
                            });

                            it("sets the fullPath of the file object", function () {
                                var file = {};
                                fileCB(file);
                                expect(file.fullPath).toBe(fe.fullPath);
                            });

                            it("calls the win callback with an array containing the file", function () {
                                var file = {};
                                fileCB(file);
                                expect(win).toHaveBeenCalledWith([file]);
                            });

                            it("resets the value of blackberry.io.sandbox", function () {
                                var file = {};
                                fileCB(file);
                                expect(blackberry.io.sandbox).toBe(true);
                            });
                        });
                    });
                });
            });
        });
    }

    testCapture('captureImage', 'photo');
    testCapture('captureVideo', 'video');

    describe("captureAudio", function(){
        it('should call the fail callback', function(){
            var args = {},
                win = jasmine.createSpy('win'),
                fail = jasmine.createSpy('fail');

            capture.captureAudio(args, win, fail);
            expect(fail).toHaveBeenCalled();
            expect(win).not.toHaveBeenCalled();
        });

        it('should return no result', function(){
            var args = "arguments",
                win = jasmine.createSpy('win'),
                fail = jasmine.createSpy('fail');

            expect(capture.captureAudio(args, win, fail)).toEqual({
                status: cordova.callbackStatus.NO_RESULT,
                message: "WebWorks Is On It"
            });
        });
    });
});
