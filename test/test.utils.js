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

describe("utils", function () {
    var utils = require('../src/common/utils');

    describe("utils.arrayIndexOf", function() {
        it("Test#001 : should return -1 when not found", function() {
            expect(utils.arrayIndexOf([1,2,3], 4)).toBe(-1);
        });
        it("Test#002 : should return 0 for first item", function() {
            expect(utils.arrayIndexOf([1,2,3], 1)).toBe(0);
        });
        it("Test#003 : should return 2 for last item", function() {
            expect(utils.arrayIndexOf([1,2,3], 3)).toBe(2);
        });
        it("Test#004 : should return index of first occurance", function() {
            expect(utils.arrayIndexOf([1,2,1], 1)).toBe(0);
        });
    });

    describe("utils.arrayRemove", function() {
        it("Test#005 : should return true when removed.", function() {
            var a = [1, 2, 3];
            expect(utils.arrayRemove(a, 2)).toBe(true);
            expect(a).toEqual([1, 3]);
        });
        it("Test#006 : should return false when item was not there.", function() {
            var a = [1, 2, 3];
            expect(utils.arrayRemove(a, 4)).toBe(false);
            expect(a).toEqual([1, 2, 3]);
        });
        it("Test#007 : should remove only first occurance", function() {
            var a = [1, 2, 1];
            expect(utils.arrayRemove(a, 1)).toBe(true);
            expect(a).toEqual([2, 1]);
        });
    });

    describe("isArray",function() {
        it("Test#008 : should return true for [].", function() {
            var isArray = utils.isArray([]);
            expect(isArray).toBe(true);
        });
        it("Test#009 : should return true for new Array().", function() {
            var isArray = utils.isArray(new Array());
            expect(isArray).toBe(true);
        });
        it("Test#010 : should return false for {}.", function() {
            var isArray = utils.isArray({});
            expect(isArray).toBe(false);
        });
    });

    describe("isDate",function() {
        it("Test#011 : should return true for new Date().", function() {
            var isDate = utils.isDate(new Date());
            expect(isDate).toBe(true);
        });
        it("Test#012 : should return false for {}.", function() {
            var isDate = utils.isDate({});
            expect(isDate).toBe(false);
        });
    });

    describe("when cloning", function () {
        it("Test#013 : can clone an array", function () {
            var orig = [1, 2, 3, {four: 4}, "5"];

            expect(utils.clone(orig)).toEqual(orig);
            expect(utils.clone(orig)).not.toBe(orig);
        });

        it("Test#014 : can clone null", function () {
            expect(utils.clone(null)).toBeNull();
        });

        it("Test#015 : can clone undefined", function () {
            expect(utils.clone(undefined)).not.toBeDefined();
        });

        it("Test#016 : can clone a function", function () {
            var f = function () { return 4; };
            expect(utils.clone(f)).toBe(f);
        });

        it("Test#017 : can clone a number", function () {
            expect(utils.clone(4)).toBe(4);
        });

        it("Test#018 : can clone a string", function () {
            expect(utils.clone("why")).toBe("why");
        });

        it("Test#19 : can clone a date", function () {
            var d = Date.now();
            expect(utils.clone(d)).toBe(d);
        });

        it("Test#020 : can clone an object", function () {

            var orig = {
                a: {
                    b: {
                        c: "d"
                    },
                },
                e: "f",
                g: "unit"
            },
            expected = {
                a: {
                    b: {
                        c: "d"
                    },
                },
                e: "f",
                g: "unit"
            };

            expect(utils.clone(orig)).toEqual(expected);
        });
    });

    describe("when closing around a function", function () {
        it("Test#021 : calls the original function when calling the closed function", function () {
            var f = jasmine.createSpy();
            utils.close(null, f)();
            expect(f).toHaveBeenCalled();
        });

        it("Test#022 : uses the correct context for the closed function", function () {
            var context = {};
            utils.close(context, function () {
                expect(this).toBe(context);
            })();
        });

        it("Test#023 : passes the arguments to the closed function", function () {
            utils.close(null, function (arg) {
                expect(arg).toBe(1);
            })(1);
        });

        it("Test#024 : overrides the arguments when provided", function () {
            utils.close(null, function (arg) {
                expect(arg).toBe(42);
            }, [42])(16);
        });
    });

    it("Test#025 : can create a uuid", function () {
        var uuid = utils.createUUID();
        expect(uuid).toMatch(/^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/);
        expect(uuid).not.toEqual(utils.createUUID());
    });
    
});
