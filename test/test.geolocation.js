describe("geolocation", function () {
    var geo = require('cordova/plugin/geolocation'),
        Position = require('cordova/plugin/Position'),
        PositionError = require('cordova/plugin/PositionError'),
        s, e,
        exec = require('cordova/exec');

    beforeEach(function () {
        s = jasmine.createSpy("success");
        e = jasmine.createSpy("error");
        exec.reset();
        geo.lastPosition = null; // reset the cached position
    });

    describe("getCurrentPosition", function() {
        describe("and passed-in arguments", function () {
            it("uses default PositionOptions if none are specified", function () {
                geo.getCurrentPosition(s, e);
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [false, 0]);
            });

            it("uses the enableHighAccuracy option if specified", function () {
                geo.getCurrentPosition(s, e, {enableHighAccuracy: true});
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [true, 0]);
            });

            it("uses the maximumAge option if specified", function () {
                geo.getCurrentPosition(s, e, {maximumAge: 100});
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [false, 100]);
            });

            it("uses a timeout value of 0 if specified and negative, which should call the error callback immediately (since we have no cached position)", function () {
                geo.getCurrentPosition(s, e, {timeout: -1000});
                expect(e).toHaveBeenCalledWith({
                    code:PositionError.TIMEOUT,
                    message:"timeout value in PositionOptions set to 0 and no cached Position object available, or cached Position object's age exceeds provided PositionOptions' maximumAge parameter."
                });
            });

            it("can be used with one, two or three arguments", function() {
                expect(function() { geo.getCurrentPosition(s); }).not.toThrow();
                expect(function() { geo.getCurrentPosition(s,e); }).not.toThrow();
                expect(function() { geo.getCurrentPosition(s,e,{}); }).not.toThrow();
            });

            it("should throw an exception if used with no arguments", function() {
                expect(function() { geo.getCurrentPosition();}).toThrow("getCurrentPosition must be called with at least one argument.");
            });
        });
        describe("position acquisition", function() {
            it("should provide a cached position if one exists and has a timestamp value conforming with passed in maximumAge", function() {
                // Create a date object from 2 seconds ago to store as cached position.
                var d = new Date();
                d.setTime(d.getTime() - 2000);
                var p = new Position(null, d);
                geo.lastPosition = p;

                geo.getCurrentPosition(s, e, {maximumAge:3000});

                expect(s).toHaveBeenCalledWith(p);
                expect(exec).not.toHaveBeenCalled();
            });

            it("should fire exec if a cached position exists but whose timestamp is longer than the maximumAge parameter", function() {
                // Create a date object from 2 seconds ago to store as cached position.
                var d = new Date();
                d.setTime(d.getTime() - 2000);
                var p = new Position(null, d);
                geo.lastPosition = p;

                geo.getCurrentPosition(s, e, {maximumAge:100});

                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [false, 100]);
            });

            it("should fire error callback with TIMEOUT code after timeout period has elapsed and no position is available", function() {
                runs(function() {
                    geo.getCurrentPosition(s, e, {timeout: 50});
                    expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [false, 0]);
                });
                
                waits(75);

                runs(function() {
                    expect(e).toHaveBeenCalledWith({
                        code:PositionError.TIMEOUT,
                        message:"Position retrieval timed out."
                    });
                });
            });

            it("should not fire error callback with TIMEOUT if a position is obtained within the timeout period", function() {
                runs(function() {
                    geo.getCurrentPosition(s, e, {timeout:50});

                    // Call the success callback to "fake" the native framework returning a (empty) position object.
                    // This should also disable the timeout timer.
                    exec.mostRecentCall.args[0]({});
                });

                waits(75);

                runs(function() {
                    expect(e).not.toHaveBeenCalled();
                    expect(s).toHaveBeenCalled();
                });
            });

            it("should fire error callback with POSITION_UNAVAILABLE if error occurs during acquisition before timeout expires", function() {
                geo.getCurrentPosition(s, e, {timeout: 50});
                
                // Call the error callback to "fake" the native framework returning an error object.
                var eObj = {
                    code:PositionError.POSITION_UNAVAILABLE
                };
                exec.mostRecentCall.args[1](eObj);

                expect(e).toHaveBeenCalledWith({
                    code:PositionError.POSITION_UNAVAILABLE,
                    message:""
                });
            });

            it("should not fire error callback with TIMEOUT if error occurs during acquisition before timeout expires", function() {
                runs(function() {
                    geo.getCurrentPosition(s, e, {timeout: 50});

                    // Call the error callback to "fake" the native framework returning an error object.
                    var eObj = {
                        code:PositionError.POSITION_UNAVAILABLE
                    };
                    exec.mostRecentCall.args[1](eObj);
                });

                waits(75);

                runs(function() {
                    expect(e).not.toHaveBeenCalledWith({
                        code:PositionError.TIMEOUT,
                        message:"Position retrieval timed out."
                    });
                });
            });
        });
    });

    describe("watchPosition", function () {
        describe("arguments", function () {
            it("uses default PositionOptions if none are specified", function () {
                var id = geo.watchPosition(s, e);
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "addWatch", [id, false]);
            });

            it("uses the enableHighAccuracy option if specified", function () {
                var id = geo.watchPosition(s, e, {enableHighAccuracy: true});
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "addWatch", [id, true]);
            });

            it("uses the maximumAge option if specified", function () {
                var id = geo.watchPosition(s, e, {maximumAge: 100});
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "addWatch", [id, false]);
            });

            it("uses a timeout value of 0 if specified and negative, which should call the error callback immediately", function () {
                geo.watchPosition(s, e, {timeout: -1000});
                expect(e).toHaveBeenCalledWith({
                    code:PositionError.TIMEOUT,
                    message:"timeout value in PositionOptions set to 0 and no cached Position object available, or cached Position object's age exceeds provided PositionOptions' maximumAge parameter."
                });
            });

            it("can be used with one, two or three arguments", function() {
                expect(function() { geo.watchPosition(s); }).not.toThrow();
                expect(function() { geo.watchPosition(s,e); }).not.toThrow();
                expect(function() { geo.watchPosition(s,e,{}); }).not.toThrow();
            });

            it("should throw an exception if used with no arguments", function() {
                expect(function() { geo.watchPosition();}).toThrow("watchPosition must be called with at least one argument.");
            });
        });
        describe("position acquisition", function() {
            it("should invoke the success callback every time the position changes", function() {
                runs(function() {
                    geo.watchPosition(s, e);
                });
                waits(50);
                runs(function() {
                    exec.mostRecentCall.args[0]({}); // fake success callback from native
                    expect(s).toHaveBeenCalled();
                    s.reset();
                    exec.mostRecentCall.args[0]({}); // fake success callback from native
                    expect(s).toHaveBeenCalled();
                });
            });
            it("should invoke the error callback if position could not be retrieved", function() {
                geo.watchPosition(s, e);
                exec.mostRecentCall.args[1]({
                    code:PositionError.POSITION_UNAVAILABLE
                });
                expect(e).toHaveBeenCalledWith({
                    code:PositionError.POSITION_UNAVAILABLE,
                    message:""
                });
            });
            it("should invoke the error callback if no position could be acquired within the specified timeout", function() {
                runs(function() {
                    geo.watchPosition(s, e, {timeout:50});
                });
                waits(75);
                runs(function() {
                    expect(e).toHaveBeenCalledWith({
                        code:PositionError.TIMEOUT,
                        message:"Position retrieval timed out."
                    });
                });
            });
            it("should invoke the error callback if no position could be acquired within the specified timeout, even after successfully retrieving the position once", function() {
                runs(function() {
                    geo.watchPosition(s, e, {timeout:50});
                });
                waits(25);
                runs(function() {
                    exec.mostRecentCall.args[0]({}); // fire new position return
                    expect(s).toHaveBeenCalled();
                });
                waits(30);
                runs(function() {
                    // The error callback should NOT be fired, since the timeout should have reset when we fired a new position return above
                    expect(e).not.toHaveBeenCalled();
                });
                waits(25);
                runs(function() {
                    // NOW the error callback should be fired with a TIMEOUT error
                    expect(e).toHaveBeenCalledWith({
                        code:PositionError.TIMEOUT,
                        message:"Position retrieval timed out."
                    });
                });
            });
        });
    });

    describe("clearWatch", function () {
        it("should tell native to remove an id from the watch list if it exists", function() {
            var id = geo.watchPosition(s, e);
            exec.reset();
            geo.clearWatch(id);
            expect(exec).toHaveBeenCalledWith(null, null, "Geolocation", "clearWatch", [id]);
        });
        it("should not call into native if id does not exist", function() {
            var id = "this is bat country";
            geo.clearWatch(id);
            expect(exec).not.toHaveBeenCalled();
        });
    });
});
