describe("utils", function () {
    var utils = require('phonegap/utils');

    describe("when cloning", function () {
        it("can clone an array", function () {
            var orig = [1, 2, 3, {four: 4}, "5"];

            expect(utils.clone(orig)).toEqual(orig);
            expect(utils.clone(orig)).not.toBe(orig);
        });

        it("can clone null", function () {
            expect(utils.clone(null)).toBeNull();
        });

        it("can clone undefined", function () {
            expect(utils.clone(undefined)).not.toBeDefined();
        });

        it("can clone a function", function () {
            var f = function () { return 4; };
            expect(utils.clone(f)).toBe(f);
        });

        it("can clone a number", function () {
            expect(utils.clone(4)).toBe(4);
        });

        it("can clone a string", function () {
            expect(utils.clone("why")).toBe("why");
        });

        it("can clone a date", function () {
            var d = Date.now();
            expect(utils.clone(d)).toBe(d);
        });

        it("can clone an object", function () {

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
});
