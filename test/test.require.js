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
            }).toThrow('module cordova already defined');
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
            }).toThrow('module your mom not found');
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
            }).toThrow('Cycle in require graph: ModuleA->ModuleB->ModuleA');
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
            }).toThrow('Cycle in require graph: ModuleA->ModuleB->ModuleC->ModuleA');
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
    });
});
