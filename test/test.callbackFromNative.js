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

describe('callbackFromNative', function () {

    beforeEach(function () {
        cordova.callbacks = {};
    });

    afterEach(function () {
        cordova.callbacks = {};
    });

    describe('cordovacallbackerror event', function () {
        var origFireWindowEvent = cordova.fireWindowEvent;
        var fireWindowEventSpy = jasmine.createSpy('fireWindowEvent');

        beforeEach(function () {
            fireWindowEventSpy.calls.reset();
            cordova.fireWindowEvent = fireWindowEventSpy;
        });

        afterEach(function () {
            cordova.fireWindowEvent = origFireWindowEvent;
        });

        it('Test#001 : should fire the cordovacallbackerror event', function () {
            var id = 'myID';
            var errorMessage = 'errorMessage';
            cordova.callbacks[id] = {
                success: function () {
                    throw new Error(errorMessage);
                }
            };
            expect(function () { cordova.callbackFromNative(id, true, cordova.callbackStatus.OK, null, false); }).toThrow();
            var event = fireWindowEventSpy.calls.argsFor(0)[0];
            var err = fireWindowEventSpy.calls.argsFor(0)[1];
            expect(event).toBe('cordovacallbackerror');
            expect(err).toBeDefined();
            expect(err.original).toBeDefined();
            expect(err.original instanceof Error).toBe(true);
            expect(err.original.message).toBe(errorMessage);
            expect(err.original.stack).toMatch(/\n/);
        });
    });
});
