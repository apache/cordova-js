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

/*global Windows:true */

var cordova = require('cordova');


module.exports = {

    getFileMetaData:function(win,fail,args) { // ["fullPath"]
        var fullPath = args[0];
    },
    getMetadata:function(win,fail,args) { // ["fullPath"]
        var fullPath = args[0];
    },
    getParent:function(win,fail,args) { // ["fullPath"]
        var fullPath = args[0];
    },
    readAsText:function(win,fail,args) { // ["fileName","encoding"]
        var fileName = args[0];
        var encoding = args[1];
    },
    readAsDataURL:function(win,fail,args) { // ["fileName"]
        var fileName = args[0];
    },
    getDirectory:function(win,fail,args) { // ["fullPath","path","options"]
        var fullPath = args[0];
        var path = args[1];
        var options = args[2];
    },
    remove:function(win,fail,args) { // ["fullPath"]
        var fullPath = args[0];
    },
    removeRecursively:function(win,fail,args) { // ["fullPath"]
        var fullPath = args[0];
    },
    getFile:function(win,fail,args) { // ["fullPath","path","options"]
        var fullPath = args[0];
        var path = args[1];
        var options = args[2];
    },
    readEntries:function(win,fail,args) { // ["fullPath"]
        var fullPath = args[0];
    },
    write:function(win,fail,args) { // ["fileName","data","position"]
        var fileName = args[0];
        var data = args[1];
        var position = args[2];
    },
    truncate:function(win,fail,args) { // ["fileName","size"]
        var fileName = args[0];
        var size = args[1];
    },
    copyTo:function(win,fail,args) { // ["fullPath","parent", "newName"]
        var fullPath = args[0];
        var parent = args[1];
        var newName = args[2];
    },
    moveTo:function(win,fail,args) { // ["fullPath","parent", "newName"]
        var fullPath = args[0];
        var parent = args[1];
        var newName = args[2];
    },
    tempFileSystem:null,
    persistentFileSystem:null,
    requestFileSystem:function(win,fail,args) { // ["type","size"]

        var type = args[0];
        var size = args[1];

    },
    resolveLocalFileSystemURI:function(win,fail,args) { // ["uri"]
        var uri = args[0];
    }

};
