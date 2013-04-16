/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var cordova = require('cordova')
var logger  = require('cordova/plugin/logger')
var exec    = require("cordova/exec")

// fake device ready, but can't test the queued messages this way
logger.__onDeviceReady()

//(function() { 



    describe("format() method", function () {
        it("handles passing nothing", function() {
            expect(logger.format()).toBe("")
        })

        it("handles empty args", function() {
            expect(logger.format("abc")).toBe("abc")
        })

        it("handles empty args and format char", function() {
            expect(logger.format("ab%oc")).toBe("ab%oc")
        })

        it("handles one arg", function() {
            expect(logger.format("a%sb", "-")).toBe("a-b")
        })

        it("handles two args", function() {
            expect(logger.format("a%sb%sc", "-", "_")).toBe("a-b_c")
        })

        it("handles an extra arg", function() {
            expect(logger.format("a%sb", "1", "2")).toBe("a1b 2")
        })

        it("handles two extra args", function() {
            expect(logger.format("a%sb", "1", "2", "3")).toBe("a1b 2 3")
        })

        it("handles unformatted strings", function() {
            expect(logger.format("a", "b", "c")).toBe("a b c")
        })

        it("handles numeric args", function() {
            expect(logger.format(1, 2, 3)).toBe("1 2 3")
        })

        it("handles the empty string", function() {
            expect(logger.format("")).toBe("")
        })

        it("handles null", function() {
            expect(logger.format(null)).toBe("")
        })

        it("handles undefined", function() {
            expect(logger.format(undefined)).toBe("")
        })

        it("handles NaN", function() {
            expect(logger.format(1/'x')).toBe('NaN')
        })

        it("handles Infinity", function() {
            expect(logger.format(1/0)).toBe('Infinity')
        })

        it("handles ('x')", function() {
            expect(logger.format('x')).toBe('x')
        })

        it("handles ('x',1)", function() {
            expect(logger.format('x', 1)).toBe('x 1')
        })

        it("handles ('%d',1)", function() {
            expect(logger.format('%d', 1)).toBe('1')
        })

        it("handles ('%d','x')", function() {
            expect(logger.format('%d', 'x')).toBe('x')
        })

        it("handles ('%s %s %s',1,2,3)", function() {
            expect(logger.format('%s %s %s', 1, 2, 3)).toBe('1 2 3')
        })

        it("handles ('1%c2%c3',1,2,3)", function() {
            expect(logger.format('1%c2%c3', 1, 2, 3)).toBe('123 3')
        })

        it("handles ('%j',{a:1})", function() {
            expect(logger.format('%j', {a:1})).toBe('{"a":1}')
        })

        it("handles ('%d: %o',1,{b:2})", function() {
            expect(logger.format('%d: %o', 1, {b:2})).toBe('1: {"b":2}')
        })

        it("handles ('%j',function(){})", function() {
            expect(logger.format('%j', function(){})).toBe('')
        })

        it("handles ('%s',function(){})", function() {
            expect(logger.format('%s', function(){})).toBe('function (){}')
        })

        it("handles ('1%%2%%3',4)", function() {
            expect(logger.format('1%%2%%3', 4)).toBe('1%2%3 4')
        })

        it("handles ('1%x2%y3',4,5)", function() {
            expect(logger.format('1%x2%y3', 4, 5)).toBe('14253')
        })

        var cycler

        beforeEach(function(){
            cycler = {a: 1}
            cycler.cycler = cycler
        })

        it("handles cyclic objects as format string", function() {
            expect(logger.format(cycler)).toBe("[object Object]")
        })

        it("handles cyclic objects as object arg", function() {
            expect(logger.format("%o", cycler)).toMatch(/^error JSON\.stringify\(\)ing argument:/)
        })

        it("handles cyclic objects as string arg", function() {
            expect(logger.format("%s", cycler)).toBe("[object Object]")
        })

    })





describe("logger using exec", function () {

    var savedLevel 
    
    beforeEach(function() {
        savedLevel = logger.level()
        logger.useConsole(false)
        exec.reset();
    })
    
    afterEach(function() {
        logger.level(savedLevel)
    })

    it("is not logging to console", function () {
        expect(logger.useConsole()).toBe(false)
    })

    it("is using level WARN by default", function () {
        expect(logger.level()).toBe(logger.WARN)
    })

    it("has it's level constants set right", function () {
        expect(logger.LOG  ).toBe("LOG")
        expect(logger.ERROR).toBe("ERROR")
        expect(logger.WARN ).toBe("WARN")
        expect(logger.INFO ).toBe("INFO")
        expect(logger.DEBUG).toBe("DEBUG")
    })

    it("supports setting the level", function () {
        logger.level(logger.INFO)
        expect(logger.level()).toBe(logger.INFO)
    })

    it("implements log() correctly", function () {
        logger.log("1")
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.LOG, "1"]);
    })

    it("implements error() correctly", function () {
        logger.error("2")
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.ERROR, "2"]);
    })

    it("implements warn() correctly", function () {
        logger.warn("3")
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.WARN, "3"]);
    })

    it("implements info() correctly", function () {
        logger.level(logger.INFO)
        logger.info("4")
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.INFO, "4"]);
    })

    it("implements debug() correctly", function () {
        logger.level(logger.DEBUG)
        logger.debug("5")
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.DEBUG, "5"]);
    })

    it("implements logLevel() correctly", function () {
        logger.logLevel("LOG", "6")
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.LOG, "6"]);
    })

    it("implements format strings correctly", function () {
        logger.log("a-%s-b-%o-c")
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.LOG, "a-%s-b-%o-c"]);

        logger.log("a-%s-b-%o-c", "xyz", {f:1, g:2})
        expect(exec).toHaveBeenCalledWith(null, null, "Logger", "logLevel", [logger.LOG, "a-xyz-b-{\"f\":1,\"g\":2}-c"]);
    })
    
})

describe("logger using console", function () {
    var loggedMessage 
    var originalConsoleLog = console.log

    function fakeConsoleLog(message) {
        loggedMessage = message
    }
    
    beforeEach(function() {
        logger.useConsole(true)
        loggedMessage = null
        console.log = fakeConsoleLog
    })
    
    afterEach(function() {
        console.log = originalConsoleLog
    })
    
    it("is logging to console", function () {
        expect(logger.useConsole()).toBe(true)
    })

    it("implements log() correctly", function () {
        logger.log("1")
        expect(loggedMessage).toBe("1")
    })

    it("implements error() correctly", function () {
        logger.error("2")
        expect(loggedMessage).toBe("ERROR: 2")
    })

    it("implements warn() correctly", function () {
        logger.warn("3")
        expect(loggedMessage).toBe("WARN: 3")
    })

    it("implements info() correctly", function () {
        logger.info("4")
        expect(loggedMessage).toBe(null)
        
        logger.level(logger.INFO)
        logger.info("4")
        expect(loggedMessage).toBe("INFO: 4")
    })

    it("implements debug() correctly", function () {
        logger.debug("5")
        expect(loggedMessage).toBe(null)

        logger.level(logger.DEBUG)
        logger.debug("5")
        expect(loggedMessage).toBe("DEBUG: 5")
    })

})

