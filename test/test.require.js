describe("require + define", function () {
    it("exist off of cordova", function () {
        var cordova = require('cordova');
        expect(cordova.require).toBeDefined();
        expect(cordova.define).toBeDefined();
    });

    describe("when defining", function () {
        it("can define and remove module", function () {
            define("a", jasmine.createSpy());
            define.remove("a");
        });

        it("can remove a module that doesn't exist", function () {
            define.remove("can't touch this");
        });

        it("throws an error the module already exists", function () {
            expect(function () {
                define("cordova", function () {});
            }).toThrow("module cordova already defined");
        });

        it("doesn't call the factory method when defining", function () {
            var factory = jasmine.createSpy();
            define("ff", factory);
            expect(factory).not.toHaveBeenCalled();
        });
    });

    describe("when requiring", function () {
        it("throws an exception when module doesn't exist", function () {
            expect(function () {
                require("your mom");
            }).toThrow("module your mom not found");
        });

        it("calls the factory method when requiring", function () {
            var factory = jasmine.createSpy();
            define("dino", factory);
            require("dino");

            expect(factory).toHaveBeenCalledWith(require,
                {}, {
                    id: "dino",
                    exports: {}
                });

            define.remove("dino");
        });

        it("returns the exports object", function () {
            define("a", function (require, exports, module) {
                exports.stuff = "asdf";
            });

            var v = require("a");
            expect(v.stuff).toBe("asdf");
            define.remove("a");
        });

        it("can use both the exports and module.exports object", function () {
            define("a", function (require, exports, module) {
                exports.a = "a";
                module.exports.b = "b";
            });

            var v = require("a");
            expect(v.a).toBe("a");
            expect(v.b).toBe("b");
            define.remove("a");
        });

        it("returns was is assigned to module.exports", function () {
            var Foo = function () { };
            define("a", function (require, exports, module) {
                module.exports = new Foo();
            });

            var v = require("a");
            expect(v instanceof Foo).toBe(true);
            define.remove("a");
        });

        it("has the id and exports values but not the factory on the module object", function () {
            var factory = function (require, exports, module) {
                expect(module.id).toBe("a");
                expect(module.exports).toBeDefined();
                expect(module.factory).not.toBeDefined();
            };

            define("a", factory);
            require("a");
        });
    });
});
