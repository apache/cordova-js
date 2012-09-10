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

/*
 * Buffer Loader Object
 * This class provides a sound buffer for one or more sounds
 * held in a local file located by an url
 *
 * uses W3C  Web Audio API
 *
 * @constructor
 *
 * @param {AudioContext} audio context object
 * @param {Array} urlList, array of url for sound to load
 * @param {function} callback , called after buffer was loaded
 *
 */

function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = [];
    this.loadCount = 0;
}

/*
 * This method loads a sound into a buffer
 * @param {Array} urlList, array of url for sound to load
 * @param {Number} index, buffer index in the array where to load the url sound
 *
 */

BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = null,
        loader = null;

    request = new XMLHttpRequest();

    if (request === null) {
        console.log ("BufferLoader.prototype.loadBuffer, cannot allocate XML http request");
        return;
    }

    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    loader = this;

    request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
        request.response,
        function(buffer) {
                if (!buffer) {
                    console.log ("BufferLoader.prototype.loadBuffer,error decoding file data: " + url);
                    return;
                }

                loader.bufferList[index] = buffer;

                if (++loader.loadCount == loader.urlList.length) {
                    loader.onload(loader.bufferList);
                }
            }
        );
    };

    request.onerror = function() {
        console.log ("BufferLoader.prototype.loadBuffer, XHR error");
    };

    request.send();
};

/*
 * This method loads all sounds identified by their url
 * and that where given to the object constructor
 *
 */

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i) {
        this.loadBuffer(this.urlList[i], i);
    }
};

module.exports = BufferLoader;
