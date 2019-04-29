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

describe('base64', function () {
    var base64 = cordova.require('cordova/base64');

    it('Test#001 : can base64 encode strings correctly', function () {
        var arrayBuffer = new ArrayBuffer(6);
        var view = new Uint8Array(arrayBuffer);
        for (var i = 0; i < view.length; i++) {
            view[i] = i;
        }
        expect(base64.fromArrayBuffer(arrayBuffer.slice(0, 1))).toBe('AA==');
        expect(base64.fromArrayBuffer(arrayBuffer.slice(0, 2))).toBe('AAE=');
        expect(base64.fromArrayBuffer(arrayBuffer.slice(0, 3))).toBe('AAEC');
        expect(base64.fromArrayBuffer(arrayBuffer.slice(0, 4))).toBe('AAECAw==');
        expect(base64.fromArrayBuffer(arrayBuffer.slice(0, 5))).toBe('AAECAwQ=');
        expect(base64.fromArrayBuffer(arrayBuffer)).toBe('AAECAwQF');
    });

    it('Test#002 : can base64 encode a binary string in an ArrayBuffer', function () {
        var arrayBuffer = new ArrayBuffer(256);
        var view = new Uint8Array(arrayBuffer);
        for (var i = 0; i < view.length; i++) {
            view[i] = i;
        }

        expect(base64.fromArrayBuffer(arrayBuffer)).toBe(
            'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4v' +
            'MDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5f' +
            'YGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6P' +
            'kJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/' +
            'wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v' +
            '8PHy8/T19vf4+fr7/P3+/w=='
        );
    });

    it('Test#003 : can base64 encode an text string in an ArrayBuffer', function () {
        var orig = 'Some Awesome Test This Is!';
        var base64string = btoa(orig);
        var arrayBuffer = new ArrayBuffer(orig.length);
        var view = new Uint8Array(arrayBuffer);

        for (var i = 0; i < orig.length; i++) {
            view[i] = orig.charCodeAt(i);
        }

        expect(base64.fromArrayBuffer(arrayBuffer)).toBe(base64string);
    });

    it('Test#004 : can decode a base64-encoded text string into an ArrayBuffer', function () {
        var orig = 'Some Awesome Test This Is!';
        var base64string = btoa(orig);

        var arrayBuffer = base64.toArrayBuffer(base64string);

        var testString = '';
        var view = new Uint8Array(arrayBuffer);
        for (var i = 0; i < view.byteLength; i++) {
            testString += String.fromCharCode(view[i]);
        }
        expect(testString).toEqual(orig);
    });
});
