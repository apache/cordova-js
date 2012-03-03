describe("compass", function () {
    var compass = require('cordova/plugin/compass'),
        utils = require('cordova/utils'),
        exec = require('cordova/exec');

    exec.reset();

    describe("when getting the current heading", function () {
        it("logs an error and doesn't call exec when no success callback given", function () {
            spyOn(console, "log");
            compass.getCurrentHeading();
            expect(console.log).toHaveBeenCalledWith("Compass Error: successCallback is not a function");
            expect(exec).not.toHaveBeenCalledWith(jasmine.any(Function), undefined, "Compass", "getHeading", []);
        });

        it("logs an error and doesn't call exec when success isn't a function", function () {
            spyOn(console, "log");
            compass.getCurrentHeading(12);
            expect(console.log).toHaveBeenCalledWith("Compass Error: successCallback is not a function");
            expect(exec).not.toHaveBeenCalledWith(jasmine.any(Function), undefined, "Compass", "getHeading", []);
        });

        it("logs an error and doesn't call exec when error isn't a function", function () {
            var func = function () {};
            spyOn(console, "log");
            compass.getCurrentHeading(func, 12);
            expect(console.log).toHaveBeenCalledWith("Compass Error: errorCallback is not a function");
            expect(exec).not.toHaveBeenCalledWith(func, 12, "Compass", "getHeading", []);
        });

        it("calls exec", function () {
            var s = function () {},
                f = function () {};

            compass.getCurrentHeading(s, f);
            expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Compass", "getHeading", []);
        });
    });

    describe("watch heading", function () {
        beforeEach(function () { 
            spyOn(window, "setInterval").andReturn("def");
        });

        it("logs an error and doesn't call exec when no success callback given", function () {
            spyOn(console, "log");
            compass.watchHeading();
            expect(console.log).toHaveBeenCalledWith("Compass Error: successCallback is not a function");
            expect(exec).not.toHaveBeenCalledWith(jasmine.any(Function), undefined, "Compass", "getHeading", []);
        });

        it("logs an error and doesn't call exec when success isn't a function", function () {
            spyOn(console, "log");
            compass.watchHeading(12);
            expect(console.log).toHaveBeenCalledWith("Compass Error: successCallback is not a function");
            expect(exec).not.toHaveBeenCalledWith(jasmine.any(Function), undefined, "Compass", "getHeading", []);
        });

        it("logs an error and doesn't call exec when error isn't a function", function () {
            var func = function () {};
            spyOn(console, "log");
            compass.watchHeading(func, 12);
            expect(console.log).toHaveBeenCalledWith("Compass Error: errorCallback is not a function");
            expect(exec).not.toHaveBeenCalledWith(func, 12, "Compass", "getHeading", []);
        });

        it("generates and returns a uuid for the watch", function () {
            spyOn(utils, "createUUID").andReturn(1234);

            var result = compass.watchHeading(function () {});
            expect(result).toBe(1234);
        });

        describe("setting the interval", function () {
            it("is 100 when not provided", function () {
                compass.watchHeading(function () {});
                expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 100);
            });

            it("is 100 when options provided with no frequency", function () {
                compass.watchHeading(function () {}, null, {});
                expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 100);
            });

            it("is the provided value", function () {
                compass.watchHeading(function () {}, null, {frequency: 200});
                expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 200);
            });
        });

        it("gets the compass value for the given interval", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            compass.watchHeading(success, fail);

            //exec the interval callback!
            window.setInterval.mostRecentCall.args[0]();
            expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Compass", "getHeading", []);
        });
    });

    describe("when clearing the watch", function () {
        beforeEach(function () {
            spyOn(window, "clearInterval");
        });

        it("doesn't clear anything if the timer doesn't exist", function () {
            compass.clearWatch("Never Gonna Give you Up");
            expect(window.clearInterval).not.toHaveBeenCalled();
        });

        it("can be called with no args", function () {
            compass.clearWatch();
            expect(window.clearInterval).not.toHaveBeenCalled();
        });
    });
});
