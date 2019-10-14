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

describe('require + define', function () {
    const { require, define } = cordova;

    function clearModules () {
        Object.keys(define.moduleMap).forEach(m => define.remove(m));
    }

    // Restore our actual modules (cordova etc.) after all tests have finished
    const originalModules = {};
    beforeAll(() => Object.assign(originalModules, define.moduleMap));
    afterAll(() => {
        clearModules();
        Object.assign(define.moduleMap, originalModules);
    });

    // Begin each test on a clean slate
    beforeEach(clearModules);

    it('exists off of cordova', function () {
        expect(require).toBeDefined();
        expect(define).toBeDefined();
    });

    describe('when defining', function () {
        it('Test#001 : can define and remove module', function () {
            define('a', jasmine.createSpy());
            expect(define.moduleMap.a).toBeDefined();

            define.remove('a');
            expect(define.moduleMap.a).toBeUndefined();
        });

        it("Test#002 : can remove a module that doesn't exist", function () {
            expect(() => {
                define.remove("can't touch this");
            }).not.toThrow();
        });

        it('Test#003 : throws an error if the module already exists', function () {
            define('cordova', function () {});
            expect(function () {
                define('cordova', function () {});
            }).toThrowError('module cordova already defined');
        });

        it("Test#004 : doesn't call the factory method when defining", function () {
            var factory = jasmine.createSpy();
            define('ff', factory);
            expect(factory).not.toHaveBeenCalled();
        });
    });

    describe('when requiring', function () {
        it("Test#005 : throws an exception when module doesn't exist", function () {
            expect(function () {
                require('your mom');
            }).toThrowError('module your mom not found');
        });

        it('Test#006 : throws an exception when modules depend on each other', function () {
            define('ModuleA', function (require, exports, module) {
                require('ModuleB');
            });
            define('ModuleB', function (require, exports, module) {
                require('ModuleA');
            });

            expect(function () {
                require('ModuleA');
            }).toThrowError('Cycle in require graph: ModuleA->ModuleB->ModuleA');
        });

        it('Test#007 : throws an exception when a cycle of requires occurs', function () {
            define('ModuleA', function (require, exports, module) {
                require('ModuleB');
            });
            define('ModuleB', function (require, exports, module) {
                require('ModuleC');
            });
            define('ModuleC', function (require, exports, module) {
                require('ModuleA');
            });

            expect(function () {
                require('ModuleA');
            }).toThrowError('Cycle in require graph: ModuleA->ModuleB->ModuleC->ModuleA');
        });

        it('Test#008 : calls the factory method when requiring', function () {
            var factory = jasmine.createSpy();
            define('dino', factory);
            require('dino');
            expect(factory).toHaveBeenCalledTimes(1);

            const [req, exports, module] = factory.calls.argsFor(0);
            expect(req).toEqual(jasmine.any(Function));
            expect(module).toEqual({ id: 'dino', exports: {} });
            expect(exports).toBe(module.exports);
        });

        it('Test#009 : returns the exports object', function () {
            define('a', function (require, exports, module) {
                exports.stuff = 'asdf';
            });

            expect(require('a').stuff).toBe('asdf');
        });

        it('Test#010 : can use both the exports and module.exports object', function () {
            define('a', function (require, exports, module) {
                exports.a = 'a';
                module.exports.b = 'b';
            });

            expect(require('a')).toEqual({ a: 'a', b: 'b' });
        });

        it('Test#011 : returns what is assigned to module.exports', function () {
            const Foo = {};
            define('a', function (require, exports, module) {
                module.exports = Foo;
            });

            expect(require('a')).toBe(Foo);
        });

        it('Test#012 : supports a unique, namespace-based flavor of relative require paths', function () {
            define('plugin.ios.foo', function (require, exports, module) {
                module.exports = require('./bar') * 2;
            });
            define('plugin.ios.bar', function (require, exports, module) {
                module.exports = 2;
            });
            expect(require('plugin.ios.foo')).toEqual(4);
        });

        // Adapted version of CommonJS test `determinism`
        it('Test#013 : does not fall back to relative modules when absolutes are not available', () => {
            define('submodule.a', function (require, exports, module) {
                expect(() => {
                    require('a');
                }).toThrowError('module a not found');
            });

            require('submodule.a');
        });

        // Adapted version of CommonJS test `absolute`
        it('Test#014 : correctly handles non-trivial dependecy graphs', () => {
            define('submodule/a', function (require, exports, module) {
                exports.foo = () => require('b');
            });
            define('b', function (require, exports, module) {
                exports.foo = () => {};
            });

            const a = require('submodule/a');
            const b = require('b');
            expect(a.foo().foo).toBe(b.foo);
        });

        // Adapted version of CommonJS test `transitive`
        it('Test#015 : correctly handles transitive dependecies', () => {
            define('a', function (require, exports, module) {
                exports.foo = require('b').foo;
            });
            define('b', function (require, exports, module) {
                exports.foo = require('c').foo;
            });
            define('c', function (require, exports, module) {
                exports.foo = () => 1;
            });

            expect(require('a').foo()).toBe(1);
        });

        // Adapted version of CommonJS test `method`
        it('Test#016 : does not bind members of `exports` implicitly', () => {
            define('a', function (require, exports, module) {
                module.exports = {
                    foo () { return this; },
                    set (x) { this.x = x; },
                    get () { return this.x; },
                    getClosed () { return module.exports.x; }
                };
            });

            const a = require('a');
            const { foo, getClosed } = a;

            expect(a.foo()).toBe(a);
            expect(foo()).toBe((function () { return this; })());

            a.set(10);
            expect(a.get()).toBe(10);
            expect(getClosed()).toBe(10);
        });

        // Adapted version of CommonJS test `nested`
        it('Test#017 : allows any strings as module names', () => {
            define('a/b/c/d', function (require, exports, module) {
                exports.foo = () => 1;
            });
            define('ラーメン', function (require, exports, module) {
                exports.foo = () => 2;
            });

            expect(require('a/b/c/d').foo()).toBe(1);
            expect(require('ラーメン').foo()).toBe(2);
        });

        // Adapted version of CommonJS test `hasOwnProperty`
        it('Test#018 : allows properties of Object.prototype as module names', () => {
            expect(() => {
                define('hasOwnProperty', jasmine.createSpy());
            }).not.toThrow();

            expect(() => {
                define('toString', jasmine.createSpy());
            }).not.toThrow();
        });
    });
});
