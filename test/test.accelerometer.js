describe("accelerometer", function () {
    var accelerometer = require("cordova/plugin/accelerometer"),
        exec = require('cordova/exec');

    beforeEach(function() {
        exec.reset();
    });

    var fakeAccelObject = {x:1,y:2,z:3};

    function callSuccess() {
        exec.mostRecentCall.args[0](fakeAccelObject);
    }

    function callError() {
        exec.mostRecentCall.args[1](fakeAccelObject);
    }

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

        describe("success", function() {
            afterEach(function() {
                // Calling the success callback for getCurrent methods should clear out the listeners
                // This way we are "starting fresh" before each test.
                callSuccess();
            });

            it("should call the exec method each time with no other listeners", function () {
                var success = function () {},
                    error = function () {};

                accelerometer.getCurrentAcceleration(success, error, "options");
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Accelerometer", "start", []);
            });
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
            var id;

            afterEach(function() {
                // Clear the watch
                accelerometer.clearWatch(id);
            });

            it("should call exec if no other listeners exist", function () {
                var success = jasmine.createSpy(),
                    fail = jasmine.createSpy();

                id = accelerometer.watchAcceleration(success, fail, {frequency: 11});

                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Accelerometer", "start", []);
            });

            it("should set a timer with the provided frequency", function() {
                spyOn(window, "setInterval");
                
                id = accelerometer.watchAcceleration(function(){}, function(){}, {frequency:50});

                expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 50);
            });

            it("should fire the timer immediately for a watch call if the accelerometer is running", function() {
                var someId = accelerometer.watchAcceleration(function(){}, function(){}, {frequency:50});

                var success = jasmine.createSpy();

                runs(function() {
                    id = accelerometer.watchAcceleration(success, function(){}, {frequency:75});
                });
                waits(5);
                runs(function() {
                    expect(success).toHaveBeenCalled();
                    accelerometer.clearWatch(someId);
                });
            });
            it("should NOT fire the timer immediately for a watch call if the accelerometer is NOT running", function() {
                var success = jasmine.createSpy();

                runs(function() {
                    id = accelerometer.watchAcceleration(success, function(){}, {frequency:75});
                });
                waits(5);
                runs(function() {
                    expect(success).not.toHaveBeenCalled();
                });
                waits(71);
                runs(function() {
                    expect(success).toHaveBeenCalled();
                });
            });
        });
    });

    describe("clearWatch", function () {
        it("doesn't clear anything if the timer doesn't exist", function () {
            accelerometer.clearWatch("Never Gonna Give you Up");
            expect(exec).not.toHaveBeenCalled();
        });
        it("should clear the watch if a timer exists", function() {
            var success = jasmine.createSpy(),
                id;
            runs(function() {
                id = accelerometer.watchAcceleration(success, function() {}, {frequency: 50});
            });
            waits(25);
            runs(function() {
                accelerometer.clearWatch(id);
            });
            waits(26);
            runs(function() {
                expect(success).not.toHaveBeenCalled();
            });
        });
        it("should call exec with stop after the last timer is cleared", function() {
            var idone,
                idtwo;

            idone = accelerometer.watchAcceleration(function(){}, function() {}, {frequency: 50});
            exec.reset();
            idtwo = accelerometer.watchAcceleration(function(){}, function() {}, {frequency: 50});

            accelerometer.clearWatch(idone);

            expect(exec).not.toHaveBeenCalled();

            accelerometer.clearWatch(idtwo);

            expect(exec).toHaveBeenCalledWith(null, null, "Accelerometer", "stop", []);
        });
    });
});
