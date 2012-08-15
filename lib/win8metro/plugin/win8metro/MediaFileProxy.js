var utils = require('cordova/utils'),
    File = require('cordova/plugin/File'),
    CaptureError = require('cordova/plugin/CaptureError');
/**
 * Represents a single file.
 *
 * name {DOMString} name of the file, without path information
 * fullPath {DOMString} the full path of the file, including the name
 * type {DOMString} mime type
 * lastModifiedDate {Date} last modified date
 * size {Number} size of the file in bytes
 */
var MediaFile = function (name, fullPath, type, lastModifiedDate, size) {
    MediaFile.__super__.constructor.apply(this, arguments);
};

utils.extend(MediaFile, File);

/**
 * Request capture format data for a specific file and type
 *
 * @param {Function} successCB
 * @param {Function} errorCB
 */
MediaFile.prototype.getFormatData = function (successCallback, errorCallback) {
    var contentType = this.type;
    if (typeof this.fullPath === "undefined" || this.fullPath === null) {
        errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
    } else {
        Windows.Storage.StorageFile.getFileFromPathAsync(this.fullPath).then(function (storageFile) {
            var mediaTypeFlag = String(contentType).split("/")[0].toLowerCase();
            if (mediaTypeFlag === "audio") {
                storageFile.properties.getMusicPropertiesAsync().then(function (audioProperties) {
                    successCallback(new MediaFileData(null, audioProperties.bitrate, 0, 0, audioProperties.duration / 1000));
                }, function () {
                    errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
                })
            }
            else if (mediaTypeFlag === "video") {
                storageFile.properties.getVideoPropertiesAsync().then(function (videoProperties) {
                    successCallback(new MediaFileData(null, videoProperties.bitrate, videoProperties.height, videoProperties.width, videoProperties.duration / 1000));
                }, function () {
                    errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
                })
            }
            else if (mediaTypeFlag === "image") {
                storageFile.properties.getImagePropertiesAsync().then(function (imageProperties) {
                    successCallback(new MediaFileData(null, 0, imageProperties.height, imageProperties.width, 0));
                }, function () {
                    errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
                })
            }
            else { errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT)) }
        }, function () {
            errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
        })
    }
};

// TODO: can we axe this?
/**
 * Casts a PluginResult message property  (array of objects) to an array of MediaFile objects
 * (used in Objective-C and Android)
 *
 * @param {PluginResult} pluginResult
 */
MediaFile.cast = function (pluginResult) {
    var mediaFiles = [];
    for (var i = 0; i < pluginResult.message.length; i++) {
        var mediaFile = new MediaFile();
        mediaFile.name = pluginResult.message[i].name;
        mediaFile.fullPath = pluginResult.message[i].fullPath;
        mediaFile.type = pluginResult.message[i].type;
        mediaFile.lastModifiedDate = pluginResult.message[i].lastModifiedDate;
        mediaFile.size = pluginResult.message[i].size;
        mediaFiles.push(mediaFile);
    }
    pluginResult.message = mediaFiles;
    return pluginResult;
};

module.exports = MediaFile;