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

describe("blackberry qnx capture", function () {
    var capture = require('cordova/plugin/qnx/capture'),
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

    describe("captureImage", function(){
        it('should call the capture function', function(){
            var args = [{ limit: -9 }, "nothingness"],
                win = jasmine.createSpy('win'),
                fail = jasmine.createSpy('fail');

            capture.captureImage(args, win, fail);
            expect(win).toHaveBeenCalled();
            
        });

        it('should call success function', function(){
            var args = [""],
                win = jasmine.createSpy('win'),
                fail = jasmine.createSpy('fail');

            capture.captureImage(args, win, fail);
            expect(win).toHaveBeenCalledWith([]);
        });

        it('should return No Result', function(){
            var args = [""],
                win = jasmine.createSpy('win'),
                fail = jasmine.createSpy('fail');

            expect(capture.captureImage(args, win, fail)).toEqual({
                status: cordova.callbackStatus.NO_RESULT,
                message: "WebWorks Is On It"
            });
        });
    });

    describe("captureVideo", function(){
        it('should call the capture function', function(){
            var args = [{ limit: -9 }, "nothingness"],
                win = jasmine.createSpy('win'),
                fail = jasmine.createSpy('fail');

            capture.captureVideo(args, win, fail);
            expect(win).toHaveBeenCalled();
        });

        it('should call success function', function(){
            var args = [""],
                win = jasmine.createSpy('win'),
                fail = jasmine.createSpy('fail');

            capture.captureVideo(args, win, fail);
            expect(win).toHaveBeenCalledWith([]);
        });

        it('should return No Result', function(){
            var args = [""],
                win = jasmine.createSpy('win'),
                fail = jasmine.createSpy('fail');

            expect(capture.captureVideo(args, win, fail)).toEqual({
                status: cordova.callbackStatus.NO_RESULT,
                message: "WebWorks Is On It"
            });
        });
    });


    describe("captureAudio", function(){
        it('should call the audio capture', function(){
            
            var args = "arguments",
                win = jasmine.createSpy('win'),
                fail = jasmine.createSpy('fail');

            capture.captureAudio(args, win, fail);
            expect(fail).toHaveBeenCalled();
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
