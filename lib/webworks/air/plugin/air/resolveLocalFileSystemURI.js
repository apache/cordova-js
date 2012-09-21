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

var DirectoryEntry = require('cordova/plugin/DirectoryEntry'),
    FileEntry = require('cordova/plugin/FileEntry'),
    FileError = require('cordova/plugin/FileError');

/**
 * Look up file system Entry referred to by local URI.
 * @param {DOMString} uri  URI referring to a local file or directory
 * @param successCallback  invoked with Entry object corresponding to URI
 * @param errorCallback    invoked if error occurs retrieving file system entry
 */
module.exports = function(uri, successCallback, errorCallback) {
    // error callback
    var fail = function(error) {
        if (typeof errorCallback === 'function') {
            errorCallback(new FileError(error));
        }
    };
    // if successful, return either a file or directory entry
    var success = function(entry) {
        var result;

        if (entry) {
            if (typeof successCallback === 'function') {
                // create appropriate Entry object
                result = (entry.isDirectory) ? new DirectoryEntry(entry.name, entry.fullPath) : new FileEntry(entry.name, entry.fullPath);
                try {
                    successCallback(result);
                }
                catch (e) {
                    console.log('Error invoking callback: ' + e);
                }
            }
        }
        else {
            // no Entry object returned
            fail(FileError.NOT_FOUND_ERR);
            return;
        }
    };

    if(!uri || uri === ""){
        fail(FileError.NOT_FOUND_ERR);
        return;
    }

    // decode uri if % char found
    if(uri.indexOf('%')>=0){
        uri = decodeURI(uri);
    }

    // pop the parameters if any
    if(uri.indexOf('?')>=0){
        uri = uri.split('?')[0];
    }

    // check for leading /
    if(uri.indexOf('/')===0){
        fail(FileError.ENCODING_ERR);
        return;
    }

    // Entry object is borked - unable to instantiate a new Entry object so just create one
    var theEntry = {};
    if(blackberry.io.dir.exists(uri)){
        theEntry.isDirectory = true;
        theEntry.name = uri.split('/').pop();
        theEntry.fullPath = uri;

        success(theEntry);
    }else if(blackberry.io.file.exists(uri)){
        theEntry.isDirectory = false;
        theEntry.name = uri.split('/').pop();
        theEntry.fullPath = uri;
        success(theEntry);
        return;
    }else{
        fail(FileError.NOT_FOUND_ERR);
        return;
    }

};
