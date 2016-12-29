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

describe('android exec.processMessages', function () {
    var cordova = require('cordova'),
        exec = require('cordova/android/exec'),
        nativeApiProvider = require('cordova/android/nativeapiprovider'),
        origNativeApi = nativeApiProvider.get();

    var nativeApi = {
        exec: jasmine.createSpy('nativeApi.exec'),
        retrieveJsMessages: jasmine.createSpy('nativeApi.retrieveJsMessages'),
    };


    beforeEach(function() {
        nativeApi.exec.reset();
        nativeApi.retrieveJsMessages.reset();
        // Avoid a log message warning about the lack of _nativeApi.
        exec.setJsToNativeBridgeMode(exec.jsToNativeModes.PROMPT);
        nativeApiProvider.set(nativeApi);
        var origPrompt = typeof prompt == 'undefined' ? undefined : prompt;
        prompt = function() { return 1234; };
        exec.init();
        prompt = origPrompt;
    });

    afterEach(function() {
        nativeApiProvider.set(origNativeApi);
        cordova.callbacks = {};
    });

    function createCallbackMessage(success, keepCallback, status, callbackId, encodedPayload) {
        var ret = '';
        ret += success ? 'S' : 'F';
        ret += keepCallback ? '1' : '0';
        ret += status;
        ret += ' ' + callbackId;
        ret += ' ' + encodedPayload;
        ret = ret.length + ' ' + ret;
        return ret;
    }

    describe('exec', function() {
        it('Test#001 : should process messages in order even when called recursively', function() {
            var firstCallbackId = null;
            var callCount = 0;
            nativeApi.exec.and.callFake(function(secret, service, action, callbackId, argsJson) {
                expect(secret).toBe(1234);
                ++callCount;
                if (callCount == 1) {
                    firstCallbackId = callbackId;
                    return '';
                }
                if (callCount == 2) {
                    return createCallbackMessage(true, false, 1, firstCallbackId, 't') +
                           createCallbackMessage(true, false, 1, callbackId, 'stwo');
                }
                return createCallbackMessage(true, false, 1, callbackId, 'sthree');
            });

            var win2Called = false;
            var winSpy3 = jasmine.createSpy('win3');

            function win1(value) {
                expect(value).toBe(true);
                exec(winSpy3, null, 'Service', 'action', []);
                expect(win2Called).toBe(false, 'win1 should finish before win2 starts');
            }

            function win2(value) {
                win2Called = true;
                expect(value).toBe('two');
                expect(winSpy3).not.toHaveBeenCalled();
            }

            exec(win1, null, 'Service', 'action', []);
            exec(win2, null, 'Service', 'action', []);
            waitsFor(function() { return winSpy3.wasCalled }, 200);
            runs(function() {
                expect(winSpy3).toHaveBeenCalledWith('three');
            });
        });
        it('Test#002 : should process messages asynchronously', function() {
            nativeApi.exec.and.callFake(function(secret, service, action, callbackId, argsJson) {
                expect(secret).toBe(1234);
                return createCallbackMessage(true, false, 1, callbackId, 'stwo');
            });

            var winSpy = jasmine.createSpy('win');

            exec(winSpy, null, 'Service', 'action', []);
            expect(winSpy).not.toHaveBeenCalled();
            waitsFor(function() { return winSpy.wasCalled }, 200);
        });
    });

    describe('processMessages', function() {
        var origCallbackFromNative = cordova.callbackFromNative,
            callbackSpy = jasmine.createSpy('callbackFromNative');

        beforeEach(function() {
            callbackSpy.reset();
            cordova.callbackFromNative = callbackSpy;
        });

        afterEach(function() {
            cordova.callbackFromNative = origCallbackFromNative;
        });

        function performExecAndReturn(messages) {

            nativeApi.exec.and.callFake(function(secret, service, action, callbackId, argsJson) {
                return messages;
            });

            exec(null, null, 'Service', 'action', []);
            // note: sometimes we need to wait for multiple callbacks, this returns after one
            // see 'should handle multiple messages' below
            waitsFor(function() { return callbackSpy.wasCalled }, 200);
        }

        it('Test#003 : should handle payloads of false', function() {
            var messages = createCallbackMessage(true, true, 1, 'id', 'f');
            performExecAndReturn(messages);
            runs(function() {
                expect(callbackSpy).toHaveBeenCalledWith('id', true, 1, [false], true);
            });
        });
        it('Test#004 : should handle payloads of true', function() {
            var messages = createCallbackMessage(true, true, 1, 'id', 't');
            performExecAndReturn(messages);
            runs(function() {
                expect(callbackSpy).toHaveBeenCalledWith('id', true, 1, [true], true);
            });
        });
        it('Test#005 : should handle payloads of null', function() {
            var messages = createCallbackMessage(true, true, 1, 'id', 'N');
            performExecAndReturn(messages);
            runs(function() {
                expect(callbackSpy).toHaveBeenCalledWith('id', true, 1, [null], true);
            });
        });
        it('Test#006 : should handle payloads of numbers', function() {
            var messages = createCallbackMessage(true, true, 1, 'id', 'n-3.3');
            performExecAndReturn(messages);
            runs(function() {
                expect(callbackSpy).toHaveBeenCalledWith('id', true, 1, [-3.3], true);
            });
        });
        it('Test#007 : should handle payloads of strings', function() {
            var messages = createCallbackMessage(true, true, 1, 'id', 'sHello world');
            performExecAndReturn(messages);
            runs(function() {
                expect(callbackSpy).toHaveBeenCalledWith('id', true, 1, ['Hello world'], true);
            });
        });
        it('Test#008 : should handle payloads of JSON objects', function() {
            var messages = createCallbackMessage(true, true, 1, 'id', '{"a":1}');
            performExecAndReturn(messages);
            runs(function() {
                expect(callbackSpy).toHaveBeenCalledWith('id', true, 1, [{a:1}], true);
            });
        });
        it('Test#009 : should handle payloads of JSON arrays', function() {
            var messages = createCallbackMessage(true, true, 1, 'id', '[1]');
            performExecAndReturn(messages);
            runs(function() {
                expect(callbackSpy).toHaveBeenCalledWith('id', true, 1, [[1]], true);
            });
        });
        it('Test#010 : should handle other callback opts', function() {
            var messages = createCallbackMessage(false, false, 3, 'id', 'sfoo');
            performExecAndReturn(messages);
            runs(function() {
                expect(callbackSpy).toHaveBeenCalledWith('id', false, 3, ['foo'], false);
            });
        });
        it('Test#011 : should handle multiple messages', function() {
            var message1 = createCallbackMessage(false, false, 3, 'id', 'sfoo');
            var message2 = createCallbackMessage(true, true, 1, 'id', 'f');
            var messages = message1 + message2;
            performExecAndReturn(messages);

            // need to wait for ALL the callbacks before we check our expects
            waitsFor(function(){
                return callbackSpy.calls.length > 1;
            },200);

            runs(function() {
                expect(callbackSpy).toHaveBeenCalledWith('id', false, 3, ['foo'], false);
                expect(callbackSpy).toHaveBeenCalledWith('id', true, 1, [false], true);
            });
        });
        it('Test#012 : should poll for more messages when hitting an *', function() {
            var message1 = createCallbackMessage(false, false, 3, 'id', 'sfoo');
            var message2 = createCallbackMessage(true, true, 1, 'id', 'f');
            nativeApi.retrieveJsMessages.and.callFake(function() {
                expect(callbackSpy).toHaveBeenCalledWith('id', false, 3, ['foo'], false);
                callbackSpy.reset();
                return message2;
            });
            performExecAndReturn(message1 + '*');
            waitsFor(function() { return nativeApi.retrieveJsMessages.wasCalled }, 500);
            runs(function() {
                expect(callbackSpy).toHaveBeenCalledWith('id', true, 1, [false], true);
            });
        });
        it('Test#013 : should call callbacks in order when one callback enqueues another.', function() {
            var message1 = createCallbackMessage(false, false, 3, 'id', 'scall1');
            var message2 = createCallbackMessage(false, false, 3, 'id', 'scall2');
            var message3 = createCallbackMessage(false, false, 3, 'id', 'scall3');

            callbackSpy.and.callFake(function() {
                if (callbackSpy.calls.length == 1) {
                    performExecAndReturn(message3);
                }
            });
            performExecAndReturn(message1 + message2);
            // need to wait for ALL the callbacks before we check our expects
            waitsFor(function(){
                return callbackSpy.calls.length > 2;
            },200);

            runs(function() {
                expect(callbackSpy.argsForCall.length).toEqual(3);
                expect(callbackSpy.argsForCall[0]).toEqual(['id', false, 3, ['call1'], false]);
                expect(callbackSpy.argsForCall[1]).toEqual(['id', false, 3, ['call2'], false]);
                expect(callbackSpy.argsForCall[2]).toEqual(['id', false, 3, ['call3'], false]);
            });
        });
    });
});
