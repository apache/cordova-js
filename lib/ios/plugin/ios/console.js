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

var exec = require('cordova/exec');

/**
 * This class provides access to the debugging console.
 * @constructor
 */
var DebugConsole = function() {
    this.logLevel = DebugConsole.INFO_LEVEL;
};

// from most verbose, to least verbose
DebugConsole.ALL_LEVEL    = 1; // same as first level
DebugConsole.INFO_LEVEL   = 1;
DebugConsole.WARN_LEVEL   = 2;
DebugConsole.ERROR_LEVEL  = 4;
DebugConsole.NONE_LEVEL   = 8;

DebugConsole.prototype.setLevel = function(level) {
    this.logLevel = level;
};

/**
 * create a nice string for an object
 */
function stringify(message) {
    try {
        if (typeof message === "object" && JSON && JSON.stringify) {
            try {
                return JSON.stringify(message);
            }
            catch (e) {
                return "error JSON.stringify()ing argument: " + e;
            }
        } else {
            return message.toString();
        }
    } catch (e) {
        return e.toString();
    }
};

/**
 * remember the original console and it's methods
 */
var origConsole = window.console || {}

var origConsole_log   = origConsole ? origConsole.log   : function(){}
var origConsole_warn  = origConsole ? origConsole.warn  : function(){}
var origConsole_error = origConsole ? origConsole.error : function(){}


/**
 * Print a normal log message to the console
 * @param {Object|String} message Message or object to print to the console
 */
DebugConsole.prototype.log = function(message) {
    origConsole_log.apply(origConsole, arguments)
    
    if (this.logLevel <= DebugConsole.INFO_LEVEL) {
        exec(null, null, 'Debug Console', 'log', [ stringify(message), { logLevel: 'INFO' } ]);
    }
};

/**
 * Print a warning message to the console
 * @param {Object|String} message Message or object to print to the console
 */
DebugConsole.prototype.warn = function(message) {
    origConsole_warn.apply(origConsole, arguments)
    
    if (this.logLevel <= DebugConsole.WARN_LEVEL) {
        exec(null, null, 'Debug Console', 'log', [ stringify(message), { logLevel: 'WARN' } ]);
    }
};

/**
 * Print an error message to the console
 * @param {Object|String} message Message or object to print to the console
 */
DebugConsole.prototype.error = function(message) {
    origConsole_error.apply(origConsole, arguments)
    
    if (this.logLevel <= DebugConsole.ERROR_LEVEL) {
        exec(null, null, 'Debug Console', 'log', [ stringify(message), { logLevel: 'ERROR' } ]);
    }
};

module.exports = new DebugConsole();
