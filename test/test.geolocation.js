describe("geolocation", function () {
    var geo = require('cordova/plugin/geolocation'),
        Position = require('cordova/plugin/Position'),
        PositionError = require('cordova/plugin/PositionError'),
        s, e;
        exec = require('cordova/exec');

    beforeEach(function () {
        s = jasmine.createSpy("success");
        e = jasmine.createSpy("error");
        exec.reset();
        geo.lastPosition = null; // reset the cached position
    });

    describe("getCurrentPosition", function() {
        describe("arguments", function () {
            it("uses default PositionOptions if none are specified", function () {
                geo.getCurrentPosition(s, e);
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [false, Infinity, 0]);
            });

            it("uses the maximumAge option if specified", function () {
                geo.getCurrentPosition(s, e, {maximumAge: 10});
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [false, Infinity, 10]);
            });

            it("uses the enableHighAccuracy option if specified", function () {
                geo.getCurrentPosition(s, e, {enableHighAccuracy: true, maximumAge: 100});
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [true, Infinity, 100]);
            });

            it("uses the timeout option if specified and positive", function () {
                geo.getCurrentPosition(s, e, {timeout: 1000});
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [false, 1000, 0]);
            });

            it("uses a timeout value of 0 if specified and negative, which should call the error callback immediately (since we have no cached position)", function () {
                geo.getCurrentPosition(s, e, {timeout: -1000});
                expect(e).toHaveBeenCalledWith({
                    code:PositionError.TIMEOUT,
                    message:"timeout value in PositionOptions set to 0 and no cached Position object available, or cached Position object's age exceed's provided PositionOptions' maximumAge parameter."
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

                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [false, Infinity, 100]);
            });

            it("should fire error callback with TIMEOUT code after timeout period has elapsed and no position is available", function() {
                runs(function() {
                    geo.getCurrentPosition(s, e, {timeout: 50});
                    expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [false, 50, 0]);
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
        var utils = require('cordova/utils');

        describe("arguments", function () {
            it("uses default PositionOptions if none are specified", function () {
                geo.watchPosition(s, e);
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [false, Infinity, 0]);
            });

            it("uses the maximumAge option if specified", function () {
                geo.watchPosition(s, e, {maximumAge: 10});
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [false, Infinity, 10]);
            });

            it("uses the enableHighAccuracy option if specified", function () {
                geo.watchPosition(s, e, {enableHighAccuracy: true, maximumAge: 100});
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [true, Infinity, 100]);
            });

            it("uses the timeout option if specified and positive", function () {
                geo.watchPosition(s, e, {timeout: 1000});
                expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Geolocation", "getLocation", [false, 1000, 0]);
            });

            it("uses a timeout value of 0 if specified and negative, which should call the error callback immediately (since we have no cached position)", function () {
                geo.watchPosition(s, e, {timeout: -1000});
                expect(e).toHaveBeenCalledWith({
                    code:PositionError.TIMEOUT,
                    message:"timeout value in PositionOptions set to 0 and no cached Position object available, or cached Position object's age exceed's provided PositionOptions' maximumAge parameter."
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
            it("should invoke the success callback every time the position changes");
            it("should invoke the error callback if position could not be retrieved");
            
        });
    });

    describe("clearWatch", function () {
    });
});
