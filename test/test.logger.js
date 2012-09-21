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

