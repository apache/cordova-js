/*
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


var modulemapper = require('cordova/modulemapper'),
    storage = require('cordova/plugin/android/storage');

var originalOpenDatabase = modulemapper.getOriginalSymbol(window, 'openDatabase');

module.exports = function(name, version, desc, size) {
    // First patch WebSQL if necessary
    if (!originalOpenDatabase) {
        // Not defined, create an openDatabase function for all to use!
        return storage.openDatabase.apply(this, arguments);
    }

    // Defined, but some Android devices will throw a SECURITY_ERR -
    // so we wrap the whole thing in a try-catch and shim in our own
    // if the device has Android bug 16175.
    try {
        return originalOpenDatabase(name, version, desc, size);
    } catch (ex) {
        if (ex.code !== 18) {
            throw ex;
        }
    }
    return storage.openDatabase(name, version, desc, size);
};


