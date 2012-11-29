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

module.exports = {
    id: "playbook",
    initialize:function() {},
    clobbers: {
        DirectoryReader:{
            path: 'cordova/plugin/air/DirectoryReader'
        },
        File:{
            path: 'cordova/plugin/air/File'
        },
        FileReader:{
            path: 'cordova/plugin/air/FileReader'
        },
        FileWriter:{
            path: 'cordova/plugin/air/FileWriter'
        },
        requestFileSystem:{
            path: 'cordova/plugin/air/requestFileSystem'
        },
        resolveLocalFileSystemURI:{
            path: 'cordova/plugin/air/resolveLocalFileSystemURI'
        }
    },
    merges: {
        DirectoryEntry: {
            path: 'cordova/plugin/air/DirectoryEntry'
        },
        Entry: {
            path: 'cordova/plugin/air/Entry'
        },
        FileEntry:{
            path: 'cordova/plugin/air/FileEntry'
        }
    }
};
