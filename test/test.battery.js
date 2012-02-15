describe("battery", function () {
    var battery = require("cordova/plugin/battery"),
        exec = require("cordova/exec");

    describe("when handling events", function () {
        it("calls exec when subscribing", function () {
            var cb = jasmine.createSpy("cb");
            window.addEventListener("batterystatus", cb);
            expect(exec).toHaveBeenCalledWith(battery._status, battery._error, "Battery", "start", []);
            window.removeEventListener("batterystatus", cb);
        });
        
        it("only calls exec once", function () {
            var cb1 = jasmine.createSpy("cb1"),
                cb2 = jasmine.createSpy("cb2");

            exec.reset();
            window.addEventListener("batterystatus", cb1);
            window.addEventListener("batterystatus", cb2);
            
            expect(exec.callCount).toBe(1);
            window.removeEventListener("batterystatus", cb1);
            window.removeEventListener("batterystatus", cb2);
        });

        it("calls stop when all handlers are removed", function () {
            var cb1 = jasmine.createSpy("cb1"),
                cb2 = jasmine.createSpy("cb2");

            window.addEventListener("batterystatus", cb1);
            window.removeEventListener("batterystatus", cb1);

            expect(exec).toHaveBeenCalledWith(null, null, "Battery", "stop", []);
        });

        it("only calls stop once", function () {
            var cb1 = jasmine.createSpy("cb1"),
                cb2 = jasmine.createSpy("cb2");

            window.addEventListener("batterystatus", cb1);
            window.addEventListener("batterystatus", cb2);
            exec.reset();
            window.removeEventListener("batterystatus", cb1);
            window.removeEventListener("batterystatus", cb2);

            expect(exec.callCount).toBe(1);
        });
    });

    describe("when monitoring the status", function () {
        var cordova = require('cordova');

        beforeEach(function () {
            spyOn(cordova, "fireWindowEvent");
        });

        //HACK: This is suspect that we can do this but
        //      it being public for now makes it very easy to 
        //      test ;)
        it("fires the battery status event", function () {
            var info = {
                level: 100,
                isPlugged: false
            };

            battery._status(info);
            expect(cordova.fireWindowEvent).toHaveBeenCalledWith("batterystatus", info);
        });

        it("doesn't fire the battery status event if the values haven't changed", function () {
            var info = {
                level: 95,
                isPlugged: false
            };

            battery._status(info);
            battery._status(info);
            expect(cordova.fireWindowEvent.callCount).toBe(1);
        });

        it("fires the battery low event when the level is 20", function () {
            var info = {
                level: 20,
                isPlugged: false
            };

            battery._status(info);
            expect(cordova.fireWindowEvent).toHaveBeenCalledWith("batterylow", info);
        });

        it("fires the battery critical event when the level is 5", function () {
            var info = {
                level: 5,
                isPlugged: false
            };

            battery._status(info);
            expect(cordova.fireWindowEvent).toHaveBeenCalledWith("batterycritical", info);
        });
    });

    it("logs errors to the console", function () {
        //HACK: shouldn't be able to test like this but public is public ;)
        var e = "We are traveling at warp speed. How did you manage to beam aboard this ship?";
        spyOn(console, "log");
        battery._error(e);

        expect(console.log).toHaveBeenCalledWith("Error initializing Battery: " + e);
    });
});
