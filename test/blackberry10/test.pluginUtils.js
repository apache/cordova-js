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

describe('blackberry10 pluginUtils', function () {

    var pluginUtils = require('cordova/plugin/blackberry10/pluginUtils');

    describe('loadClientJs', function () {

        var callback,
            script;

        beforeEach(function () {
            script = {};
            spyOn(document, "createElement").andCallFake(function () {
                return script;
            });
            spyOn(document.head, "appendChild");
            callback = jasmine.createSpy();
        });

        it('does nothing for 0 plugins', function () {
            var plugins = {};
            pluginUtils.loadClientJs(plugins, callback);
            expect(document.createElement).not.toHaveBeenCalled();
            expect(document.head.appendChild).not.toHaveBeenCalled();
            expect(callback).not.toHaveBeenCalled();
        });

        it('adds a script tag for 1 plugin', function () {
            var plugins = { foo : { client: ['bar.js'] } };
            pluginUtils.loadClientJs(plugins, callback);
            expect(document.createElement).toHaveBeenCalled();
            expect(script.src).toEqual('plugins/foo/bar.js');
            expect(document.head.appendChild).toHaveBeenCalled();
            script.onload();
            expect(callback).toHaveBeenCalled();
        });

        it('adds multiple script tags for 1 plugin', function () {
            var plugins = { foo: { client: ['bar.js', '2.js'] } };
            pluginUtils.loadClientJs(plugins, callback);
            expect(document.createElement.callCount).toBe(2);
            expect(document.head.appendChild.callCount).toBe(2);
            script.onload();
            script.onload();
            expect(callback.callCount).toBe(1);
        });

        it('adds script tags for multiple plugins', function () {
            var plugins = { foo: { client: ['1.js'] }, bar: { client: ['1.js', '2.js' ] } };
            pluginUtils.loadClientJs(plugins, callback);
            expect(document.createElement.callCount).toBe(3);
            expect(document.head.appendChild.callCount).toBe(3);
            script.onload();
            script.onload();
            script.onload();
            expect(callback.callCount).toBe(1);
        });

    });

    describe('getPlugins', function () {

        var success,
            error,
            xhr;

        beforeEach(function () {
            GLOBAL.XMLHttpRequest = function () {
                this.open = jasmine.createSpy();
                this.send = jasmine.createSpy();
                xhr = this;
            };
            success = jasmine.createSpy();
            error = jasmine.createSpy();
        });

        afterEach(function () {
            delete GLOBAL.XMLHttpRequest;
        });

        it('sends XHR for plugins.json', function () {
            pluginUtils.getPlugins(success, error);
            expect(xhr.open).toHaveBeenCalledWith('GET', 'plugins/plugins.json', true);
            expect(xhr.send).toHaveBeenCalled();
        });

        it('calls success with JSON response', function () {
            pluginUtils.getPlugins(success, error);
            xhr.readyState = 4;
            xhr.status = 200;
            xhr.responseText = '{ "hello" : "World" }';
            xhr.onreadystatechange();
            expect(success).toHaveBeenCalledWith({ hello: "World"});
            expect(error).not.toHaveBeenCalled();
        });

        it('calls error with status', function () {
            pluginUtils.getPlugins(success, error);
            xhr.readyState = 4;
            xhr.status = 500;
            xhr.onreadystatechange();
            expect(error).toHaveBeenCalledWith(500);
            expect(success).not.toHaveBeenCalled();
        });

        it('calls error with parse exception', function () {
            pluginUtils.getPlugins(success, error);
            xhr.readyState = 4;
            xhr.status = 200;
            xhr.responseText = 'INVALID';
            xhr.onreadystatechange();
            expect(error).toHaveBeenCalled();
            expect(success).not.toHaveBeenCalled();
        });

    });
});
