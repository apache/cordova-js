describe("geolocation", function () {
    var geo = require('cordova/plugin/geolocation'),
        s, e;
        exec = require('cordova/exec');

    beforeEach(function () {
        s = jasmine.createSpy("success");
        e = jasmine.createSpy("error");
    });

    describe("when getting the current position", function () {
        it("uses the default values", function () {
            geo.getCurrentPosition(s, e);
            expect(exec).toHaveBeenCalledWith(s, e, "Geolocation", "getLocation", [false, 10000, 10000]);
        });

        it("uses the maximumAge option", function () {
            geo.getCurrentPosition(s, e, {maximumAge: 10});
            expect(exec).toHaveBeenCalledWith(s, e, "Geolocation", "getLocation", [false, 10000, 10]);
        });

        it("uses the enableHighAccuracy option", function () {
            geo.getCurrentPosition(s, e, {enableHighAccuracy: true, maximumAge: 100});
            expect(exec).toHaveBeenCalledWith(s, e, "Geolocation", "getLocation", [true, 10000, 100]);
        });

        it("uses the timeout option", function () {
            geo.getCurrentPosition(s, e, {timeout: 1000});
            expect(exec).toHaveBeenCalledWith(s, e, "Geolocation", "getLocation", [false, 1000, 10000]);
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
            expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 10000);
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
