/*
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

describe('iOS exec', () => {
    var exec = cordova.require('cordova/ios/exec');
    var successSpy = jasmine.createSpy('success');

    beforeEach(() => {
        successSpy.calls.reset();
    });

    describe('exec', () => {
        it('Test#001 : should successfully execute the provided function passed to nativeEvalAndFetch.', () => {
            exec.nativeEvalAndFetch(() => {
                successSpy();
            });
            expect(successSpy).toHaveBeenCalled();
        });

        it('Test#002 : should show an error message in console, when the provided function to nativeEvalAndFetch has an error.', () => {
            spyOn(console, 'log');

            exec.nativeEvalAndFetch(function () {
                throw new Error('An error was thrown.');
            });

            expect(console.log).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching(/An error was thrown\./));
        });

        it('Test#003 : should trigger the callbackFromNative method when calling nativeCallback.', () => {
            const callbackId = 1;
            const status = 0;
            const message = 'it passed';
            const keepCallback = false;

            spyOn(cordova, 'callbackFromNative').and.callFake((...args) => {
                expect(args).toEqual([
                    callbackId,
                    true,
                    [message],
                    keepCallback
                ]);
            });

            exec.nativeCallback(callbackId, status, message, keepCallback);
        });
    });
});
