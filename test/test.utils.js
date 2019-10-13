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

describe('utils', function () {
    var utils = cordova.require('cordova/utils');

    describe('isArray', function () {
        it('Test#008 : should return true for [].', function () {
            var isArray = utils.isArray([]);
            expect(isArray).toBe(true);
        });
        it('Test#009 : should return true for new Array().', function () {
            // eslint-disable-next-line no-array-constructor
            var isArray = utils.isArray(new Array());
            expect(isArray).toBe(true);
        });
        it('Test#010 : should return false for {}.', function () {
            var isArray = utils.isArray({});
            expect(isArray).toBe(false);
        });
    });

    describe('isDate', function () {
        it('Test#011 : should return true for new Date().', function () {
            var isDate = utils.isDate(new Date());
            expect(isDate).toBe(true);
        });
        it('Test#012 : should return false for {}.', function () {
            var isDate = utils.isDate({});
            expect(isDate).toBe(false);
        });
    });

    describe('when cloning', function () {
        it('Test#013 : can clone an array', function () {
            var orig = [1, 2, 3, { four: 4 }, '5'];

            expect(utils.clone(orig)).toEqual(orig);
            expect(utils.clone(orig)).not.toBe(orig);
        });

        it('Test#014 : can clone null', function () {
            expect(utils.clone(null)).toBeNull();
        });

        it('Test#015 : can clone undefined', function () {
            expect(utils.clone(undefined)).not.toBeDefined();
        });

        it('Test#016 : can clone a function', function () {
            var f = function () { return 4; };
            expect(utils.clone(f)).toBe(f);
        });

        it('Test#017 : can clone a number', function () {
            expect(utils.clone(4)).toBe(4);
        });

        it('Test#018 : can clone a string', function () {
            expect(utils.clone('why')).toBe('why');
        });

        it('Test#19 : can clone a date', function () {
            var d = Date.now();
            expect(utils.clone(d)).toBe(d);
        });

        it('Test#020 : can clone an object', function () {
            var orig = {
                a: {
                    b: {
                        c: 'd'
                    }
                },
                e: 'f',
                g: 'unit'
            };
            var expected = {
                a: {
                    b: {
                        c: 'd'
                    }
                },
                e: 'f',
                g: 'unit'
            };

            expect(utils.clone(orig)).toEqual(expected);
        });
    });

    it('Test#025 : can create a uuid', function () {
        var uuid = utils.createUUID();
        expect(uuid).toMatch(/^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/);
        expect(uuid).not.toEqual(utils.createUUID());
    });
});
