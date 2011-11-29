describe("accelerometer", function () {
    var accelerometer = require("phonegap/plugin/accelerometer");

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
            expect(PhoneGap.exec).toHaveBeenCalledWith(success, error, "Accelerometer", "getAcceleration", []);
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

        it("calls exec to get the timeout", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            spyOn(window, "setInterval");
            accelerometer.watchAcceleration(success, fail);

            expect(PhoneGap.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Accelerometer", "getTimeout", []);
        });

        it("sets the timeout to be greater than 10 seconds if less", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            spyOn(window, "setInterval");
            accelerometer.watchAcceleration(success, fail, {frequency: 5000});

            //execute the success callback ;)
            PhoneGap.exec.mostRecentCall.args[0](5000);

            expect(PhoneGap.exec).toHaveBeenCalledWith(null, null, "Accelerometer", "setTimeout", [15000]);
        });
    });
});
