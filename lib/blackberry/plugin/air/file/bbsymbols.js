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


var modulemapper = require('cordova/modulemapper');

modulemapper.clobbers('cordova/plugin/air/DirectoryReader', 'DirectoryReader');
modulemapper.clobbers('cordova/plugin/air/File', 'File');
modulemapper.clobbers('cordova/plugin/air/FileReader', 'FileReader');
modulemapper.clobbers('cordova/plugin/air/FileWriter', 'FileWriter');
modulemapper.clobbers('cordova/plugin/air/requestFileSystem', 'requestFileSystem');
modulemapper.clobbers('cordova/plugin/air/resolveLocalFileSystemURI', 'resolveLocalFileSystemURI');
modulemapper.merges('cordova/plugin/air/DirectoryEntry', 'DirectoryEntry');
modulemapper.merges('cordova/plugin/air/Entry', 'Entry');
modulemapper.merges('cordova/plugin/air/FileEntry', 'FileEntry');

