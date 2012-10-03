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

describe("FileTransfer", function() {
    var FileTransfer = new (require('cordova/plugin/FileTransfer'))();
    describe("download", function() {
        it("should throw an exception if source or target is not defined", function() {
            var win = jasmine.createSpy(),
                fail = jasmine.createSpy();

            expect(function() {
                FileTransfer.download(null, null, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.download(undefined, undefined, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.download(null, undefined, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.download(undefined, null, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.download("test.txt", undefined, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.download(undefined, "http://google.com/robots.txt", win, fail);
            }).toThrow();
        });
    });

    describe("upload", function() {
        it("should throw an exception if filePath or server is not defined", function() {
            var win = jasmine.createSpy(),
                fail = jasmine.createSpy();

            expect(function() {
                FileTransfer.upload(null, null, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.upload(undefined, undefined, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.upload(null, undefined, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.upload(undefined, null, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.upload("test.txt", undefined, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.upload(undefined, "http://google.com/robots.txt", win, fail);
            }).toThrow();
        });
    });
});
