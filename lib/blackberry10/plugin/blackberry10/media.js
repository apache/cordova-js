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

var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils');

var mediaObjects = {};

/**
 * This class provides access to the device media, interfaces to both sound and video
 *
 * @constructor
 * @param src                   The file name or url to play
 * @param successCallback       The callback to be called when the file is done playing or recording.
 *                                  successCallback()
 * @param errorCallback         The callback to be called if there is an error.
 *                                  errorCallback(int errorCode) - OPTIONAL
 * @param statusCallback        The callback to be called when media status has changed.
 *                                  statusCallback(int statusCode) - OPTIONAL
 */
var Media = function(src, successCallback, errorCallback, statusCallback) {
    argscheck.checkArgs('SFFF', 'Media', arguments);
    this.id = utils.createUUID();
    mediaObjects[this.id] = this;
    this.src = src;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    this.statusCallback = statusCallback;
    this._duration = -1;
    this._position = -1;
    this._audio = new Audio(src);

    var that = this;
    this._audio.addEventListener("error", function () {
        Media.onStatus(that.id, Media.MEDIA_ERROR, this.error);
    }, false);
    this._audio.addEventListener("timeupdate", function () {
        Media.onStatus(that.id, Media.MEDIA_POSITION, that._audio.currentTime);
    }, false);
    this._audio.addEventListener("durationchange", function () {
        Media.onStatus(that.id, Media.MEDIA_DURATION, that._audio.duration);
    }, false);
    this._audio.addEventListener("pause", function () {
        if (this._audio.currentTime === 0) {
            Media.onStatus(that.id, Media.MEDIA_STATE, Media.MEDIA_STOPPED);
        } else {
            Media.onStatus(that.id, Media.MEDIA_STATE, Media.MEDIA_PAUSED);
        }
    }, false);
    this._audio.addEventListener("loadstart", function () {
        Media.onStatus(that.id, Media.MEDIA_STATE, Media.MEDIA_STARTING);
    }, false);
    this._audio.addEventListener("canplaythrough", function () {
        Media.onStatus(that.id, Media.MEDIA_STATE, Media.MEDIA_RUNNING);
    }, false);
};

// Media messages
Media.MEDIA_STATE = 1;
Media.MEDIA_DURATION = 2;
Media.MEDIA_POSITION = 3;
Media.MEDIA_ERROR = 9;

// Media states
Media.MEDIA_NONE = 0;
Media.MEDIA_STARTING = 1;
Media.MEDIA_RUNNING = 2;
Media.MEDIA_PAUSED = 3;
Media.MEDIA_STOPPED = 4;
Media.MEDIA_MSG = ["None", "Starting", "Running", "Paused", "Stopped"];

// "static" function to return existing objs.
Media.get = function(id) {
    return mediaObjects[id];
};

/**
 * Start or resume playing audio file.
 */
Media.prototype.play = function(options) {
    if (this._audio) {
        this._audio.play();
    }
};

/**
 * Stop playing audio file.
 */
Media.prototype.stop = function() {
    if (this._audio) {
        this._audio.pause();
        this._audio.currentTime = 0;
    }
};

/**
 * Seek or jump to a new time in the track..
 */
Media.prototype.seekTo = function(milliseconds) {
    if (this._audio) {
        try {
            this._audio.currentTime = 1000 * milliseconds;
        } catch (e) {
            console.log("Error seeking audio: " + e);
        }
    }
};

/**
 * Pause playing audio file.
 */
Media.prototype.pause = function() {
    if (this._audio) {
        this._audio.pause();
    }
};

/**
 * Get duration of an audio file.
 * The duration is only set for audio that is playing, paused or stopped.
 *
 * @return      duration or -1 if not known.
 */
Media.prototype.getDuration = function() {
    if (this._audio) {
        return this._audio.duration;
    } else {
        return -1;
    }
};

/**
 * Get position of audio.
 */
Media.prototype.getCurrentPosition = function(success, fail) {
    if (this._audio) {
        success(this._audio.currentTime);
    } else {
        fail("Audio Object has not been initialized");
    }
};

/**
 * Start recording audio file.
 */
Media.prototype.startRecord = function() {
    this.errorCallback("Not supported");
};

/**
 * Stop recording audio file.
 */
Media.prototype.stopRecord = function() {
    this.errorCallback("Not supported");
};

/**
 * Release the resources.
 */
Media.prototype.release = function() {
    this._audio.src = undefined;
    this._audio = undefined;
};

/**
 * Adjust the volume.
 */
Media.prototype.setVolume = function(volume) {
    if (this._audio) {
        this._audio.volume = volume;
    }
};

/**
 * Audio has status update.
 * PRIVATE
 *
 * @param id            The media object id (string)
 * @param msgType       The 'type' of update this is
 * @param value         Use of value is determined by the msgType
 */
Media.onStatus = function(id, msgType, value) {

    var media = mediaObjects[id];

    if(media) {
        switch(msgType) {
            case Media.MEDIA_STATE :
                media.statusCallback && media.statusCallback(value);
                if(value == Media.MEDIA_STOPPED) {
                    media.successCallback && media.successCallback();
                }
                break;
            case Media.MEDIA_DURATION :
                media._duration = value;
                break;
            case Media.MEDIA_ERROR :
                media.errorCallback && media.errorCallback(value);
                break;
            case Media.MEDIA_POSITION :
                media._position = Number(value);
                break;
            default :
                console.error && console.error("Unhandled Media.onStatus :: " + msgType);
                break;
        }
    }
    else {
         console.error && console.error("Received Media.onStatus callback for unknown media :: " + id);
    }

};

module.exports = Media;
