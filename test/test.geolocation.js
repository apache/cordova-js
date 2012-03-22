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
    });

    describe("when getting the current position", function () {
        beforeEach(function() {
            geo.lastPosition = null; // reset the cached position
        });

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

    describe("when watching the position", function () {
        var utils = require('cordova/utils');

        beforeEach(function () {
            spyOn(window, "setInterval").andReturn("2");
            spyOn(utils, "createUUID").andReturn("leeroy jenkins");
        });

        it("gets and returns an id from createUUID", function () {
            var id = geo.watchPosition(s, e);
            expect(utils.createUUID).toHaveBeenCalled();
            expect(id).toBe("leeroy jenkins");
        });

        it("sets an interval for the default timeout", function () {
            geo.watchPosition(s, e);
            expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), Infinity);
        });

        it("sets an interval for the provided timeout", function () {
            geo.watchPosition(s, e, {timeout: 10});
            expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 10);
        });

        it("calls exec on the given interval", function () {
            geo.watchPosition(s, e);
            var func = window.setInterval.mostRecentCall.args[0];
            func();
            expect(exec).toHaveBeenCalled();
        });
    });

    describe("when clearing the watch", function () {
        beforeEach(function () {
            spyOn(window, "setInterval").andReturn("woohoo");
            spyOn(window, "clearInterval");
        });

        it("calls clear interval for the watch", function () {
            var timer = geo.watchPosition(s, e);
            geo.clearWatch(timer);
            expect(window.clearInterval).toHaveBeenCalledWith("woohoo");
        });

        it("only calls clear interval once", function () {
            var timer = geo.watchPosition(s, e);
            geo.clearWatch(timer);
            geo.clearWatch(timer);
            expect(window.clearInterval.callCount).toBe(1);
        });

        it("doesn't call clear interval when no watch", function () {
            geo.clearWatch("derp");
            expect(window.clearInterval).not.toHaveBeenCalled();
        });
    });
});
