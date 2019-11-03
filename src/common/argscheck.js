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

var utils = require('cordova/utils');

var moduleExports = module.exports;

var typeMap = {
    'A': 'Array',
    'D': 'Date',
    'N': 'Number',
    'S': 'String',
    'F': 'Function',
    'O': 'Object'
};

function extractParamName (callee, argIndex) {
    return (/\(\s*([^)]*?)\s*\)/).exec(callee)[1].split(/\s*,\s*/)[argIndex];
}

/**
 * Checks the given arguments' types and throws if they are not as expected.
 *
 * `spec` is a string where each character stands for the required type of the
 * argument at the same position. In other words: the character at `spec[i]`
 * specifies the required type for `args[i]`. The characters in `spec` are the
 * first letter of the required type's name. The supported types are:
 *
 *     Array, Date, Number, String, Function, Object
 *
 * Lowercase characters specify arguments that must not be `null` or `undefined`
 * while uppercase characters allow those values to be passed.
 *
 * Finally, `*` can be used to allow any type at the corresponding position.
 *
 * @example
 * function foo (arr, opts) {
 *     // require `arr` to be an Array and `opts` an Object, null or undefined
 *     checkArgs('aO', 'my.package.foo', arguments);
 *     // ...
 * }
 * @param {String} spec - the type specification for `args` as described above
 * @param {String} functionName - full name of the callee.
 * Used in the error message
 * @param {Array|arguments} args - the arguments to be checked against `spec`
 * @param {Function} [opt_callee=args.callee] - the recipient of `args`.
 * Used to extract parameter names for the error message
 * @throws {TypeError} if args do not satisfy spec
 */
function checkArgs (spec, functionName, args, opt_callee) {
    var errMsg = null;
    var typeName;
    for (var i = 0; i < spec.length; ++i) {
        var c = spec.charAt(i);
        var cUpper = c.toUpperCase();
        var arg = args[i];
        // Asterix means allow anything.
        if (c === '*') {
            continue;
        }
        typeName = utils.typeName(arg);
        if ((arg === null || arg === undefined) && c === cUpper) {
            continue;
        }
        if (typeName !== typeMap[cUpper]) {
            errMsg = 'Expected ' + typeMap[cUpper];
            break;
        }
    }
    if (errMsg) {
        errMsg += ', but got ' + typeName + '.';
        errMsg = 'Wrong type for parameter "' + extractParamName(opt_callee || args.callee, i) + '" of ' + functionName + ': ' + errMsg;
        // Don't log when running unit tests.
        if (typeof jasmine === 'undefined') {
            console.error(errMsg);
        }
        throw TypeError(errMsg);
    }
}

function getValue (value, defaultValue) {
    return value === undefined ? defaultValue : value;
}

moduleExports.checkArgs = checkArgs;
moduleExports.getValue = getValue;
