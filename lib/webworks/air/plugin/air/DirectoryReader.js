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

var FileError = require('cordova/plugin/FileError');

/**
 * An interface that lists the files and directories in a directory.
 */
function DirectoryReader(path) {
    this.path = path || null;
}

/**
 * Returns a list of entries from a directory.
 *
 * @param {Function} successCallback is called with a list of entries
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryReader.prototype.readEntries = function(successCallback, errorCallback) {
    var win = typeof successCallback !== 'function' ? null : function(result) {
        var retVal = [];
        for (var i=0; i<result.length; i++) {
            var entry = null;
            if (result[i].isDirectory) {
                entry = new (require('cordova/plugin/DirectoryEntry'))();
            }
            else if (result[i].isFile) {
                entry = new (require('cordova/plugin/FileEntry'))();
            }
            entry.isDirectory = result[i].isDirectory;
            entry.isFile = result[i].isFile;
            entry.name = result[i].name;
            entry.fullPath = result[i].fullPath;
            retVal.push(entry);
        }
        successCallback(retVal);
    };
    var fail = typeof errorCallback !== 'function' ? null : function(code) {
        errorCallback(new FileError(code));
    };

    var theEntries = [];
    // Entry object is borked - unable to instantiate a new Entry object so just create one
    var anEntry = function (isDirectory, name, fullPath) {
        this.isDirectory = (isDirectory ? true : false);
        this.isFile = (isDirectory ? false : true);
        this.name = name;
        this.fullPath = fullPath;
    };

    if(blackberry.io.dir.exists(this.path)){
        var theDirectories = blackberry.io.dir.listDirectories(this.path);
        var theFiles = blackberry.io.dir.listFiles(this.path);

        var theDirectoriesLength = theDirectories.length;
        var theFilesLength = theFiles.length;
        for(var i=0;i<theDirectoriesLength;i++){
            theEntries.push(new anEntry(true, theDirectories[i], this.path+theDirectories[i]));
        }

        for(var j=0;j<theFilesLength;j++){
            theEntries.push(new anEntry(false, theFiles[j], this.path+theFiles[j]));
        }
        win(theEntries);
    }else{
        fail(FileError.NOT_FOUND_ERR);
    }


};

module.exports = DirectoryReader;
