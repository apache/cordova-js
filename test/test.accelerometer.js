describe("accelerometer", function () {
    var accelerometer = require("phonegap/plugin/accelerometer"),
        exec = require('phonegap/exec');

    describe("when getting the current acceleration", function () {
        describe("when passing in bad data", function () {
            it("logs the error message when missing the successCallback", function () {
                spyOn(console, "log");
                accelerometer.getCurrentAcceleration();
                expect(console.log).toHaveBeenCalledWith("Accelerometer Error: successCallback is not a function");
            });

            it("logs the error message when the success callback isn't a function", function () {
                spyOn(console, "log");
                accelerometer.getCurrentAcceleration("ponies");
                expect(console.log).toHaveBeenCalledWith("Accelerometer Error: successCallback is not a function");
            });

            it("logs the error message the error callback isn't a function", function () {
                spyOn(console, "log");
                accelerometer.getCurrentAcceleration(jasmine.createSpy(), "rainbows");
                expect(console.log).toHaveBeenCalledWith("Accelerometer Error: errorCallback is not a function");
            });
        });

        it("calls the exec method", function () {
            var success = function () {},
                error = function () {};

            accelerometer.getCurrentAcceleration(success, error, "options");
            expect(exec).toHaveBeenCalledWith(success, error, "Accelerometer", "getAcceleration", []);
        });
    });

    describe("when watching the acceleration", function () {
        describe("when passing in bad data", function () {
            it("logs the error message when missing the successCallback", function () {
                spyOn(console, "log");
                accelerometer.watchAcceleration();
                expect(console.log).toHaveBeenCalledWith("Accelerometer Error: successCallback is not a function");
            });

            it("logs the error message when the success callback isn't a function", function () {
                spyOn(console, "log");
                accelerometer.watchAcceleration("ponies");
                expect(console.log).toHaveBeenCalledWith("Accelerometer Error: successCallback is not a function");
            });

            it("logs the error message the error callback isn't a function", function () {
                spyOn(console, "log");
                accelerometer.watchAcceleration(jasmine.createSpy(), "rainbows");
                expect(console.log).toHaveBeenCalledWith("Accelerometer Error: errorCallback is not a function");
            });
        });

        describe("when working with the timeout", function () {
            it("calls exec to get the timeout", function () {
                var success = jasmine.createSpy(),
                    fail = jasmine.createSpy();

                spyOn(window, "setInterval");
                accelerometer.watchAcceleration(success, fail);

                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Accelerometer", "getTimeout", []);
            });

            it("it sets it to 10 seconds greater than the frequency", function () {
                var success = jasmine.createSpy(),
                    fail = jasmine.createSpy();

                spyOn(window, "setInterval");
                accelerometer.watchAcceleration(success, fail, {frequency: 5000});

                //execute the success callback ;)
                exec.mostRecentCall.args[0](5000);

                expect(exec).toHaveBeenCalledWith(null, null, "Accelerometer", "setTimeout", [15000]);
            });

            it("doesn't set it if timeout is less than freq + 10sec", function () {
                var success = jasmine.createSpy(),
                    fail = jasmine.createSpy();

                spyOn(window, "setInterval");
                accelerometer.watchAcceleration(success, fail, {frequency: 1000});

                //execute the success callback ;)
                exec.mostRecentCall.args[0](20000);

                expect(exec).not.toHaveBeenCalledWith(null, null, "Accelerometer", "setTimeout", [11000]);
            });
        });

        it("returns a generated interval id", function () {
            var utils = require('phonegap/utils'),
                success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            spyOn(window, "setInterval");
            spyOn(utils, "createUUID").andReturn(42);

            expect(accelerometer.watchAcceleration(success, fail)).toBe(42);
        });

        it("returns the interval ID", function () {
            var utils = require('phonegap/utils'),
                success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            spyOn(window, "setInterval").andReturn(1);
            spyOn(utils, "createUUID").andReturn(42);

            accelerometer.watchAcceleration(success, fail);

            expect(accelerometer.timers[42]).toBe(1);
        });

        it("starts the interval with the provided frequency", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            spyOn(window, "setInterval");
            accelerometer.watchAcceleration(success, fail, {frequency: 11});

            expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 11);
        });

        it("starts the interval with the default frequency", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            spyOn(window, "setInterval");
            accelerometer.watchAcceleration(success, fail);

            expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 10000);
        });

        it("gets the acceleration for the provided interval", function () {
            var utils = require('phonegap/utils'),
                success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            spyOn(window, "setInterval");
            accelerometer.watchAcceleration(success, fail, {frequency: 11});

            //exec the interval callback!
            window.setInterval.mostRecentCall.args[0]();

            expect(exec).toHaveBeenCalledWith(success, fail, "Accelerometer", "getAcceleration", []);
        });
    });

    describe("when clearing the watch", function () {
        beforeEach(function () {
            spyOn(window, "clearInterval");
        });

        it("doesn't clear anything if the timer doesn't exist", function () {
            accelerometer.clearWatch("Never Gonna Give you Up");
            expect(window.clearInterval).not.toHaveBeenCalled();
        });

        it("can be called with no args", function () {
            accelerometer.clearWatch();
            expect(window.clearInterval).not.toHaveBeenCalled();
        });

        it("clears the interval if the id exists", function () {
            accelerometer.timers["frank"] = "beans";
            accelerometer.clearWatch("frank");
            expect(window.clearInterval).toHaveBeenCalledWith("beans");
        });
    });
});
