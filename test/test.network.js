describe("network", function () {
    var network,
        exec = require('cordova/exec');
       
    it("should fire exec on first-run", function() {
        exec.reset();

        network = require('cordova/plugin/network');

        expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "NetworkStatus", "getConnectionInfo", []);
    });

    //TODO: There is a lot of code executed on the first require call to this plugin
    //      we should refactor or find a good way to call and test this code.
    //      
    //      since exec is a spy we can scrounge the list of calls to find it, but I would
    //      rather refactor to have something a little cleaner (maybe move this code into the init
    //      routine for the platform)

    it("can get the network info", function () {
        var success = jasmine.createSpy(),
            error = jasmine.createSpy();

        network.getInfo(success, error);
        expect(exec).toHaveBeenCalledWith(success, error, "NetworkStatus", "getConnectionInfo", []);
    });
});
