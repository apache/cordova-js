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

var origFileReader = window.FileReader,
    fileUtils = require('cordova/plugin/blackberry10/fileUtils'),
    utils = require('cordova/utils');

var FileReader = function() {
    this.nativeReader = new origFileReader();
};

utils.defineGetter(FileReader.prototype, 'readyState', function() {
    return this.nativeReader.readyState;
});

utils.defineGetter(FileReader.prototype, 'error', function() {
    return this.nativeReader.error;
});

utils.defineGetter(FileReader.prototype, 'result', function() {
    return this.nativeReader.result;
});

function defineEvent(eventName) {
    utils.defineGetterSetter(FileReader.prototype, eventName, function() {
        return this.nativeReader[eventName] || null;
    }, function(value) {
        this.nativeReader[eventName] = value;
    });
}

defineEvent('onabort');
defineEvent('onerror');
defineEvent('onload');
defineEvent('onloadend');
defineEvent('onloadstart');
defineEvent('onprogress');

FileReader.prototype.abort = function() {
    return this.nativeReader.abort();
};

FileReader.prototype.readAsText = function(file, encoding) {
    var that = this;
    fileUtils.getEntryForURI(file.fullPath, function (entry) {
        entry.nativeEntry.file(function (nativeFile) {
            that.nativeReader.readAsText(nativeFile, encoding);
        }, that.onerror);
    }, that.onerror);
};

FileReader.prototype.readAsDataURL = function(file) {
    var that = this;
    fileUtils.getEntryForURI(file.fullPath, function (entry) {
        entry.nativeEntry.file(function (nativeFile) {
            that.nativeReader.readAsDataURL(nativeFile);
        }, that.onerror);
    }, that.onerror);
};

FileReader.prototype.readAsBinaryString = function(file) {
    var that = this;
    fileUtils.getEntryForURI(file.fullPath, function (entry) {
        entry.nativeEntry.file(function (nativeFile) {
            that.nativeReader.readAsBinaryString(nativeFile);
        }, that.onerror);
    }, that.onerror);
};

FileReader.prototype.readAsArrayBuffer = function(file) {
    var that = this;
    fileUtils.getEntryForURI(file.fullPath, function (entry) {
        entry.nativeEntry.file(function (nativeFile) {
            that.nativeReader.readAsArrayBuffer(nativeFile);
        }, that.onerror);
    }, that.onerror);
};

window.FileReader = FileReader;
module.exports = FileReader;
