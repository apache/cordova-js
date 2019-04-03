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

describe('pluginloader', function () {
    const { define } = cordova;
    var pluginloader = cordova.require('cordova/pluginloader');
    var injectScript;
    var cdvScript;
    beforeEach(function () {
        injectScript = spyOn(pluginloader, 'injectScript');
        var el = document.createElement('script');
        el.setAttribute('type', 'foo');
        el.src = 'foo/cordova.js?bar';
        document.body.appendChild(el);
        cdvScript = el;
    });
    afterEach(function () {
        if (cdvScript) {
            cdvScript.parentNode.removeChild(cdvScript);
            cdvScript = null;
        }
        define.remove('cordova/plugin_list');
        define.remove('some.id');
    });

    it('Test#001 : should inject cordova_plugins.js when it is not already there', function (done) {
        injectScript.and.callFake(function (url, onload, onerror) {
            // jsdom deficiencies:
            if (typeof location !== 'undefined') {
                expect(url).toBe(window.location.href.replace(/\/[^\/]*?$/, '/foo/cordova_plugins.js')); // eslint-disable-line no-useless-escape
            } else {
                expect(url).toBe('foo/cordova_plugins.js');
            }
            /* eslint-disable no-undef */
            define('cordova/plugin_list', function (require, exports, module) {
                module.exports = [];
            });
            onload();
        });

        pluginloader.load(done);
    });

    it('Test#002 : should not inject cordova_plugins.js when it is already there', function (done) {
        define('cordova/plugin_list', function (require, exports, module) {
            module.exports = [];
        });

        pluginloader.load(() => {
            expect(injectScript).not.toHaveBeenCalled();
            done();
        });
    });

    it('Test#003 : should inject plugin scripts when they are not already there', function (done) {
        define('cordova/plugin_list', function (require, exports, module) {
            module.exports = [
                { 'file': 'some/path.js', 'id': 'some.id' }
            ];
        });
        injectScript.and.callFake(function (url, onload, onerror) {
            // jsdom deficiencies:
            if (typeof location !== 'undefined') {
                expect(url).toBe(window.location.href.replace(/\/[^\/]*?$/, '/foo/some/path.js')); // eslint-disable-line no-useless-escape
            } else {
                expect(url).toBe('foo/some/path.js');
            }
            define('some.id', function (require, exports, module) {
            });
            onload();
        });

        pluginloader.load(done);
    });

    it('Test#004 : should not inject plugin scripts when they are already there', function (done) {
        define('cordova/plugin_list', function (require, exports, module) {
            module.exports = [
                { 'file': 'some/path.js', 'id': 'some.id' }
            ];
        });
        define('some.id', function (require, exports, module) {
        });

        pluginloader.load(() => {
            expect(injectScript).not.toHaveBeenCalled();
            done();
        });
    });
});
