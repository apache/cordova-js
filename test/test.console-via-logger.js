describe("console-via-logger", function () {

    var cordova = require('cordova')
    var logger  = require('cordova/plugin/logger')
    var console = require('cordova/plugin/console-via-logger')
    var exec    = require("cordova/exec")
    var savedLevel 
    
    // fake device ready, but can't test the queued messages this way
    logger.__onDeviceReady()

    //--------------------------------------------------------------------------
    beforeEach(function() {
        savedLevel = logger.level()
        logger.level(logger.DEBUG)
        logger.useConsole(false)
        console.useLogger(true)
        exec.reset();
    })
    
    //--------------------------------------------------------------------------
    afterEach(function() {
        logger.level(savedLevel)
        logger.useConsole(true)
        console.useLogger(false)
    })
    
    //--------------------------------------------------------------------------
    it("is using the logger", function () {
        expect(console.useLogger()).toBe(true)
    })

    //--------------------------------------------------------------------------
    it("is not being used by logger", function () {
        expect(logger.useConsole()).toBe(false)
    })

    //--------------------------------------------------------------------------
    it("implements log() correctly", function () {
        console.log("%s", "1")
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.LOG, "1"]);
    })

    //--------------------------------------------------------------------------
    it("implements error() correctly", function () {
        console.error("%s", "2")
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.ERROR, "2"]);
    })

    //--------------------------------------------------------------------------
    it("implements warn() correctly", function () {
        console.warn("%s", "3")
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.WARN, "3"]);
    })

    //--------------------------------------------------------------------------
    it("implements info() correctly", function () {
        console.info("%s", "4")
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.INFO, "4"]);
    })

    //--------------------------------------------------------------------------
    it("implements debug() correctly", function () {
        console.debug("%s", "5")
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.DEBUG, "5"]);
    })

    //--------------------------------------------------------------------------
    it("implements assert(false) correctly", function () {
        console.assert(false, "%s", 6)
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.LOG, "ASSERT: 6"]);
    })
        
    it("implements assert(true) correctly", function () {
        console.assert(true, "%s", 6)
        expect(exec).not.toHaveBeenCalled();
    })

    //--------------------------------------------------------------------------
    it("does nothing for clear()", function () {
        console.clear()
        expect(exec).not.toHaveBeenCalled();
    })
    
    //--------------------------------------------------------------------------
    it("implements dir() correctly", function () {
        console.dir({a:1, b:2})
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.LOG, '{"a":1,"b":2}']);
    })
    
    //--------------------------------------------------------------------------
    it("implements dirxml() correctly", function () {
        console.dirxml({ innerHTML: "<b>nonce</b>" })
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.LOG, "<b>nonce</b>"]);
    })

    //--------------------------------------------------------------------------
    it("does nothing for trace()", function () {
        console.trace()
        expect(exec).not.toHaveBeenCalled();
    })
    
    //--------------------------------------------------------------------------
    it("implements group() correctly", function () {
        console.group("%s", 7)
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.LOG, "7"]);
    })

    //--------------------------------------------------------------------------
    it("implements groupCollapsed() correctly", function () {
        console.groupCollapsed("%s", 8)
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.LOG, "8"]);
    })

    //--------------------------------------------------------------------------
    it("does nothing for groupEnd()", function () {
        console.groupEnd()
        expect(exec).not.toHaveBeenCalled();
    })

    //--------------------------------------------------------------------------
    it("implements time() and timeEnd() correctly", function () {
        runs(function() {
            console.time("foo")
            expect(exec).not.toHaveBeenCalled();
        })
        
        waits(50)
        
        runs(function() {
            console.timeEnd("foo")
            var message = exec.mostRecentCall.args[4][1]
            expect(message).toMatch(/foo: \d+ms/)
        })
    })

    //--------------------------------------------------------------------------
    it("does nothing for timeStamp()", function () {
        console.timeStamp()
        expect(exec).not.toHaveBeenCalled();
    })

    //--------------------------------------------------------------------------
    it("does nothing for profile()", function () {
        console.profile()
        expect(exec).not.toHaveBeenCalled();
    })

    //--------------------------------------------------------------------------
    it("does nothing for profileEnd()", function () {
        console.profileEnd()
        expect(exec).not.toHaveBeenCalled();
    })

    //--------------------------------------------------------------------------
    it("does nothing for count()", function () {
        console.count()
        expect(exec).not.toHaveBeenCalled();
    })

    //--------------------------------------------------------------------------
    it("implements exception() correctly", function () {
        console.exception(new Error("bar"))
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.LOG, "Error: bar"]);
    })

    //--------------------------------------------------------------------------
    it("implements table() correctly", function () {
        console.table({c:3,d:4})
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.LOG, '{"c":3,"d":4}']);
    })
})
