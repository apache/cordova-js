describe("accelerometer", function () {
    var accelerometer = require("cordova/plugin/accelerometer"),
        exec = require('cordova/exec');

    beforeEach(function() {
        exec.reset();
    });

    describe("getCurrentAcceleration", function () {
        describe("failure", function () {
            it("should throw exception if bad success callback passed in", function () {
                expect(function() {
                    accelerometer.getCurrentAcceleration();
                }).toThrow();
                expect(function() {
                    accelerometer.getCurrentAcceleration(null);
                }).toThrow();
                expect(function() {
                    accelerometer.getCurrentAcceleration({call:function(){}, apply:function(){}});
                }).toThrow();
            });
        });

        it("should call the exec method", function () {
            var success = function () {},
                error = function () {};

            accelerometer.getCurrentAcceleration(success, error, "options");
            expect(exec).toHaveBeenCalledWith(success, error, "Accelerometer", "getAcceleration", []);
        });
    });

    describe("watchAcceleration", function () {
        describe("failure", function () {
            it("throws an exception if bad successCallback", function () {
                expect(function() {
                    accelerometer.watchAcceleration();
                }).toThrow();
                expect(function() {
                    accelerometer.watchAcceleration(null);
                }).toThrow();
                expect(function() {
                    accelerometer.watchAcceleration({call:function(){}, apply:function(){}});
                }).toThrow();
            });
        });

        describe('success', function() {
            it("should call exec with a provided frequency", function () {
                var success = jasmine.createSpy(),
                    fail = jasmine.createSpy();

                accelerometer.watchAcceleration(success, fail, {frequency: 11});

                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Accelerometer", "addWatch", [jasmine.any(String), 11]);
            });

            it("should call exec with default frequency if no options provided", function () {
                var success = jasmine.createSpy(),
                    fail = jasmine.createSpy();

                accelerometer.watchAcceleration(success, fail);

                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Accelerometer", "addWatch", [jasmine.any(String), 10000]);
            });
        });
    });

    describe("when clearing the watch", function () {
        it("doesn't clear anything if the timer doesn't exist", function () {
            accelerometer.clearWatch("Never Gonna Give you Up");
            expect(exec).not.toHaveBeenCalled();
        });

        it("doesnt invoke exec if no id provided", function () {
            accelerometer.clearWatch();
            expect(exec).not.toHaveBeenCalled();
        });

        it("invokes exec if watch exists", function() {
            var id = accelerometer.watchAcceleration(function(){}, function(){});
            exec.reset();
            accelerometer.clearWatch(id);
            expect(exec).toHaveBeenCalledWith(null, null, "Accelerometer", "clearWatch", [id]);
        });
    });
});
