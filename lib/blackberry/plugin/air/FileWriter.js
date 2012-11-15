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

var FileError = require('cordova/plugin/FileError'),
    ProgressEvent = require('cordova/plugin/ProgressEvent');

/**
 * @constructor
 * @param file {File} File object containing file properties
 * @param append if true write to the end of the file, otherwise overwrite the file
 */
var FileWriter = function(file) {
    this.fileName = "";
    this.length = 0;
    if (file) {
        this.fileName = file.fullPath || file;
        this.length = file.size || 0;
    }
    // default is to write at the beginning of the file
    this.position = 0;

    this.readyState = 0; // EMPTY

    this.result = null;

    // Error
    this.error = null;

    // Event handlers
    this.onwritestart = null;   // When writing starts
    this.onprogress = null;     // While writing the file, and reporting partial file data
    this.onwrite = null;        // When the write has successfully completed.
    this.onwriteend = null;     // When the request has completed (either in success or failure).
    this.onabort = null;        // When the write has been aborted. For instance, by invoking the abort() method.
    this.onerror = null;        // When the write has failed (see errors).
};

// States
FileWriter.INIT = 0;
FileWriter.WRITING = 1;
FileWriter.DONE = 2;

/**
 * Abort writing file.
 */
FileWriter.prototype.abort = function() {
    // check for invalid state
    if (this.readyState === FileWriter.DONE || this.readyState === FileWriter.INIT) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    // set error
    this.error = new FileError(FileError.ABORT_ERR);

    this.readyState = FileWriter.DONE;

    // If abort callback
    if (typeof this.onabort === "function") {
        this.onabort(new ProgressEvent("abort", {"target":this}));
    }

    // If write end callback
    if (typeof this.onwriteend === "function") {
        this.onwriteend(new ProgressEvent("writeend", {"target":this}));
    }
};

/**
 * Writes data to the file
 *
 * @param text to be written
 */
FileWriter.prototype.write = function(text) {
    // Throw an exception if we are already writing a file
    if (this.readyState === FileWriter.WRITING) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    // WRITING state
    this.readyState = FileWriter.WRITING;

    var me = this;

    // If onwritestart callback
    if (typeof me.onwritestart === "function") {
        me.onwritestart(new ProgressEvent("writestart", {"target":me}));
    }

    var textBlob = blackberry.utils.stringToBlob(text);

    if(blackberry.io.file.exists(this.fileName)){

        var oldText = '';
        var newText = text;

        var getFileContents = function(path,blob){

            if(blob){
                oldText = blackberry.utils.blobToString(blob);
                if(oldText.length>0){
                    newText = oldText.substr(0,me.position) + text;
                }
            }

            var tempFile = me.fileName+'temp';
            if(blackberry.io.file.exists(tempFile)){
                blackberry.io.file.deleteFile(tempFile);
            }

            var newTextBlob = blackberry.utils.stringToBlob(newText);

            // crete a temp file, delete file we are 'overwriting', then rename temp file
            blackberry.io.file.saveFile(tempFile, newTextBlob);
            blackberry.io.file.deleteFile(me.fileName);
            blackberry.io.file.rename(tempFile, me.fileName.split('/').pop());

            me.position = newText.length;
            me.length = me.position;

            if (typeof me.onwrite === "function") {
                me.onwrite(new ProgressEvent("write", {"target":me}));
            }
        };

        // setting asynch to off
        blackberry.io.file.readFile(this.fileName, getFileContents, false);

    }else{

        // file is new so just save it
        blackberry.io.file.saveFile(this.fileName, textBlob);
        me.position = text.length;
        me.length = me.position;
    }

    me.readyState = FileWriter.DONE;

    if (typeof me.onwriteend === "function") {
                me.onwriteend(new ProgressEvent("writeend", {"target":me}));
    }
};

/**
 * Moves the file pointer to the location specified.
 *
 * If the offset is a negative number the position of the file
 * pointer is rewound.  If the offset is greater than the file
 * size the position is set to the end of the file.
 *
 * @param offset is the location to move the file pointer to.
 */
FileWriter.prototype.seek = function(offset) {
    // Throw an exception if we are already writing a file
    if (this.readyState === FileWriter.WRITING) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    if (!offset && offset !== 0) {
        return;
    }

    // See back from end of file.
    if (offset < 0) {
        this.position = Math.max(offset + this.length, 0);
    }
    // Offset is bigger than file size so set position
    // to the end of the file.
    else if (offset > this.length) {
        this.position = this.length;
    }
    // Offset is between 0 and file size so set the position
    // to start writing.
    else {
        this.position = offset;
    }
};

/**
 * Truncates the file to the size specified.
 *
 * @param size to chop the file at.
 */
FileWriter.prototype.truncate = function(size) {
    // Throw an exception if we are already writing a file
    if (this.readyState === FileWriter.WRITING) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    // WRITING state
    this.readyState = FileWriter.WRITING;

    var me = this;

    // If onwritestart callback
    if (typeof me.onwritestart === "function") {
        me.onwritestart(new ProgressEvent("writestart", {"target":this}));
    }

    if(blackberry.io.file.exists(this.fileName)){

        var oldText = '';
        var newText = '';

        var getFileContents = function(path,blob){

            if(blob){
                oldText = blackberry.utils.blobToString(blob);
                if(oldText.length>0){
                    newText = oldText.slice(0,size);
                }else{
                    // TODO: throw error
                }
            }

            var tempFile = me.fileName+'temp';
            if(blackberry.io.file.exists(tempFile)){
                blackberry.io.file.deleteFile(tempFile);
            }

            var newTextBlob = blackberry.utils.stringToBlob(newText);

            // crete a temp file, delete file we are 'overwriting', then rename temp file
            blackberry.io.file.saveFile(tempFile, newTextBlob);
            blackberry.io.file.deleteFile(me.fileName);
            blackberry.io.file.rename(tempFile, me.fileName.split('/').pop());

            me.position = newText.length;
            me.length = me.position;

            if (typeof me.onwrite === "function") {
                 me.onwrite(new ProgressEvent("write", {"target":me}));
            }
        };

        // setting asynch to off - worry about making this all callbacks later
        blackberry.io.file.readFile(this.fileName, getFileContents, false);

    }else{

        // TODO: file doesn't exist - throw error

    }

    me.readyState = FileWriter.DONE;

    if (typeof me.onwriteend === "function") {
                me.onwriteend(new ProgressEvent("writeend", {"target":me}));
    }
};

module.exports = FileWriter;
