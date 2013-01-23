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

describe("blackberry qnx fileTransfer", function () {
    var fileTransfer = require('cordova/plugin/qnx/fileTransfer');
    var cordova = require('cordova'),
        win = jasmine.createSpy('win'),
        fail = jasmine.createSpy('fail')
        xhrSend = jasmine.createSpy('xhr send');
        xhrOpen = jasmine.createSpy('xhr open');

    beforeEach(function () {
        global.blackberry = {
            io:{
                filetransfer: {
                    download: jasmine.createSpy('download'),
                    upload: jasmine.createSpy('upload')
                }
            }
        };
        XMLHttpRequest = function () {
            var xhr = {
                send: xhrSend,
                open: xhrOpen
            };
            return xhr;
        };
        window.webkitResolveLocalFileSystemURL = jasmine.createSpy("resolveFS")
    });

    afterEach(function () {
        delete global.blackberry;
        delete XMLHttpRequest;
        delete webkitResolveLocalFileSystemURL;
        delete window.webkitResolveLocalFileSystemURL;
    });

    describe("download", function(){
        it('should call the blackberry download', function () {
            fileTransfer.download(["source/file", "target/file"], win, fail);
            expect(xhrOpen).toHaveBeenCalled();
            expect(xhrSend).toHaveBeenCalled();
        });

        it('should return No Result', function(){
            expect(fileTransfer.download(["location/source", "location/place/here"], win, fail)).toEqual({
                status: cordova.callbackStatus.NO_RESULT,
                message: "async"
            });
        });
    });

    describe('upload', function(){
        it('should call the blackberry upload', function(){
            fileTransfer.upload(["source", "target", "fileKey", "fileName", "mimeType", "params", "chunkedMode"], win, fail);
            expect(xhrOpen).toHaveBeenCalled();
            expect(xhrSend).toHaveBeenCalled();
        });

        it('should return No Result', function(){
            expect(fileTransfer.upload(["location/source", "location/place/here"], win, fail)).toEqual({
                status: cordova.callbackStatus.NO_RESULT,
                message: "async"
            });
        });
    });
});
