var utils = require('cordova/utils'),
    File = require('cordova/plugin/File'),
    CaptureError = require('cordova/plugin/CaptureError');
    MediaFileData = require('cordova/plugin/MediaFileData');

module.exports = {
	getFormatData:function (successCallback, errorCallback, args) {
	    var contentType = args[1];
	    Windows.Storage.StorageFile.getFileFromPathAsync(args[0]).then(function (storageFile) {
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
	        }
	    )
	}
}
