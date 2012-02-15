describe("utils", function () {
    var utils = require('cordova/utils');

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

    describe("when closing around a function", function () {
        it("calls the original function when calling the closed function", function () {
            var f = jasmine.createSpy();
            utils.close(null, f)();
            expect(f).toHaveBeenCalled();
        });

        it("uses the correct context for the closed function", function () {
            var context = {};
            utils.close(context, function () {
                expect(this).toBe(context);
            })();
        });

        it("passes the arguments to the closed function", function () {
            utils.close(null, function (arg) {
                expect(arg).toBe(1);
            })(1);
        });

        it("overrides the arguments when provided", function () {
            utils.close(null, function (arg) {
                expect(arg).toBe(42);
            }, [42])(16);
        });
    });

    it("can create a uuid", function () {
        var uuid = utils.createUUID();
        expect(uuid).toMatch(/^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/);
        expect(uuid).not.toEqual(utils.createUUID());
    });
});
