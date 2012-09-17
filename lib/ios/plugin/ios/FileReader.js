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

var exec = require('cordova/exec'),
    FileError = require('cordova/plugin/FileError'),
    FileReader = require('cordova/plugin/FileReader'),
    ProgressEvent = require('cordova/plugin/ProgressEvent');

module.exports = {
    readAsText:function(file, encoding) {
        // Figure out pathing
        this.fileName = '';
        if (typeof file.fullPath === 'undefined') {
            this.fileName = file;
        } else {
            this.fileName = file.fullPath;
        }

        // Already loading something
        if (this.readyState == FileReader.LOADING) {
            throw new FileError(FileError.INVALID_STATE_ERR);
        }

        // LOADING state
        this.readyState = FileReader.LOADING;

        // If loadstart callback
        if (typeof this.onloadstart === "function") {
            this.onloadstart(new ProgressEvent("loadstart", {target:this}));
        }

        // Default encoding is UTF-8
        var enc = encoding ? encoding : "UTF-8";

        var me = this;

        // Read file
        exec(
            // Success callback
            function(r) {
                // If DONE (cancelled), then don't do anything
                if (me.readyState === FileReader.DONE) {
                    return;
                }

                // Save result
                me.result = decodeURIComponent(r);

                // If onload callback
                if (typeof me.onload === "function") {
                    me.onload(new ProgressEvent("load", {target:me}));
                }

                // DONE state
                me.readyState = FileReader.DONE;

                // If onloadend callback
                if (typeof me.onloadend === "function") {
                    me.onloadend(new ProgressEvent("loadend", {target:me}));
                }
            },
            // Error callback
            function(e) {
                // If DONE (cancelled), then don't do anything
                if (me.readyState === FileReader.DONE) {
                    return;
                }

                // DONE state
                me.readyState = FileReader.DONE;

                // null result
                me.result = null;

                // Save error
                me.error = new FileError(e);

                // If onerror callback
                if (typeof me.onerror === "function") {
                    me.onerror(new ProgressEvent("error", {target:me}));
                }

                // If onloadend callback
                if (typeof me.onloadend === "function") {
                    me.onloadend(new ProgressEvent("loadend", {target:me}));
                }
            },
        "File", "readAsText", [this.fileName, enc]);
    }
};
