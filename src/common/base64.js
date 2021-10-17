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

var base64 = exports;

base64.fromArrayBuffer = function (arrayBuffer) {
    return btoa(bufferToBinaryString(arrayBuffer));
};

base64.toArrayBuffer = function (str) {
    return binaryStringToBuffer(atob(str));
};

function bufferToBinaryString (buffer) {
    var bytes = new Uint8Array(buffer);
    var CHUNK_SIZE = 1 << 15;
    var string = '';
    for (var i = 0; i < bytes.length; i += CHUNK_SIZE) {
        var chunk = bytes.subarray(i, i + CHUNK_SIZE);
        string += String.fromCharCode.apply(null, chunk);
    }
    return string;
}

function binaryStringToBuffer (binaryString) {
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < bytes.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
