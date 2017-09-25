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

/* jshint jasmine:true */

describe('iOS exec', function () {
    var exec = require('cordova/ios/exec');
    var winSpy = jasmine.createSpy('win');
    var failSpy = jasmine.createSpy('fail');
    var origUserAgent = navigator.userAgent;

    beforeEach(function () {
        winSpy.reset();
        failSpy.reset();
    });

    afterEach(function () {
        navigator.__defineGetter__('userAgent', function () {
            return origUserAgent;
        });
    });

    function simulateNativeBehaviour (codes) { // eslint-disable-line no-unused-vars
        var execPayload = JSON.parse(exec.nativeFetchMessages());
        while (execPayload.length && codes.length) {
            var curPayload = execPayload.shift();
            var callbackId = curPayload[0];
            var moreResults = exec.nativeCallback(callbackId, codes.shift(), 'payload', false);
            if (moreResults) {
                execPayload.push.apply(execPayload, JSON.parse(moreResults));
            }
        }
        expect(codes.length).toBe(0, 'Wrong number of results.');
    }

    describe('exec', function () {
        it('should return "" from nativeFetchMessages work when nothing is pending.', function () {
            var execPayload = exec.nativeFetchMessages();
            expect(execPayload).toBe('');
        });
    });
});
