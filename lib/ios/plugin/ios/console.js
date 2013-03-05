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
            return (typeof message === "undefined") ? "undefined" : message.toString();
        }
    } catch (e) {
        return e.toString();
    }
}

/**
 * Wrapper one of the console logging methods, so that
 * the Cordova logging native is called, then the original.
 */
function wrappedMethod(console, method) {
    var origMethod = console[method];

    return function() {

        var args = [].slice.call(arguments),
            len = args.length,
            i = 0,
            res = [];

        for ( ; i < len; i++) {
            res.push(stringify(args[i]));
        }

        exec(null, null,
            'Debug Console', 'log',
            [ res.join(' '), { logLevel: method.toUpperCase() } ]
        );

        if (!origMethod) return;

        origMethod.apply(console, arguments);
    };
}

var console = window.console || {};

// 2012-10-06 pmuellr - marking setLevel() method and logLevel property
// on console as deprecated;
// it didn't do anything useful, since the level constants weren't accessible
// to anyone

console.setLevel = function() {};
console.logLevel = 0;

// wrapper the logging messages

var methods = ["log", "debug", "info", "warn", "error"];

for (var i=0; i<methods.length; i++) {
    var method = methods[i];

    console[method] = wrappedMethod(console, method);
}

module.exports = console;
