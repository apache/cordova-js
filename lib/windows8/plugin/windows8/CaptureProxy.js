
﻿/*global Windows:true */


var MediaFile = require('cordova/plugin/MediaFile');
var CaptureError = require('cordova/plugin/CaptureError');
var CaptureAudioOptions = require('cordova/plugin/CaptureAudioOptions');
var CaptureImageOptions = require('cordova/plugin/CaptureImageOptions');
var CaptureVideoOptions = require('cordova/plugin/CaptureVideoOptions');
var MediaFileData = require('cordova/plugin/MediaFileData');

module.exports = {

    captureAudio:function(successCallback, errorCallback, args) {
        var options = args[0];

        var audioOptions = new CaptureAudioOptions();
        if (typeof(options.duration) == 'undefined') {
            audioOptions.duration = 3600; // Arbitrary amount, need to change later
        } else if (options.duration > 0) {
            audioOptions.duration = options.duration;
        } else {
            errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
            return;
        }
        var cameraCaptureAudioDuration = audioOptions.duration;

        var mediaCaputreSettings;
        var initCaptureSettings = function () {
            mediaCaputreSettings = null;
            mediaCaputreSettings = new Windows.Media.Capture.MediaCaptureInitializationSettings();
            mediaCaputreSettings.streamingCaptureMode = Windows.Media.Capture.StreamingCaptureMode.audio;
        };
        initCaptureSettings();
        var mediaCapture = new Windows.Media.Capture.MediaCapture();
        mediaCapture.initializeAsync(mediaCaputreSettings).done(function () {
            Windows.Storage.KnownFolders.musicLibrary.createFileAsync("captureAudio.mp3", Windows.Storage.NameCollisionOption.generateUniqueName).then(function (storageFile) {
                var mediaEncodingProfile = new Windows.Media.MediaProperties.MediaEncodingProfile.createMp3(Windows.Media.MediaProperties.AudioEncodingQuality.auto);
                var stopRecord = function () {
                    mediaCapture.stopRecordAsync().then(function (result) {
                        storageFile.getBasicPropertiesAsync().then(function (basicProperties) {
                            var results = [];
                            results.push(new MediaFile(storageFile.name, storageFile.path, storageFile.contentType, basicProperties.dateModified, basicProperties.size));
                            successCallback(results);
                        }, function () {
                            errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
                        });
                    }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); });
                };
                mediaCapture.startRecordToStorageFileAsync(mediaEncodingProfile, storageFile).then(function () {
                    setTimeout(stopRecord, cameraCaptureAudioDuration * 1000);
                }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); });
            }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); });
        });
    },

    captureImage:function (successCallback, errorCallback, args) {
        var options = args[0];
        var imageOptions = new CaptureImageOptions();
        var cameraCaptureUI = new Windows.Media.Capture.CameraCaptureUI();
        cameraCaptureUI.photoSettings.allowCropping = true;
        cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.highestAvailable;
        cameraCaptureUI.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.jpeg;
        cameraCaptureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).then(function (file) {
            file.moveAsync(Windows.Storage.KnownFolders.picturesLibrary, "cameraCaptureImage.jpg", Windows.Storage.NameCollisionOption.generateUniqueName).then(function () {
                file.getBasicPropertiesAsync().then(function (basicProperties) {
                    var results = [];
                    results.push(new MediaFile(file.name, file.path, file.contentType, basicProperties.dateModified, basicProperties.size));
                    successCallback(results);
                }, function () {
                    errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
                });
            }, function () {
                errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
            });
        }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); });
    },

    captureVideo:function (successCallback, errorCallback, args) {
        var options = args[0];
        var videoOptions = new CaptureVideoOptions();
        if (options.duration && options.duration > 0) {
            videoOptions.duration = options.duration;
        }
        if (options.limit > 1) {
            videoOptions.limit = options.limit;
        }
        var cameraCaptureUI = new Windows.Media.Capture.CameraCaptureUI();
        cameraCaptureUI.videoSettings.allowTrimming = true;
        cameraCaptureUI.videoSettings.format = Windows.Media.Capture.CameraCaptureUIVideoFormat.mp4;
        cameraCaptureUI.videoSettings.maxDurationInSeconds = videoOptions.duration;
        cameraCaptureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.video).then(function (file) {
            file.moveAsync(Windows.Storage.KnownFolders.videosLibrary, "cameraCaptureVedio.mp4", Windows.Storage.NameCollisionOption.generateUniqueName).then(function () {
                file.getBasicPropertiesAsync().then(function (basicProperties) {
                    var results = [];
                    results.push(new MediaFile(file.name, file.path, file.contentType, basicProperties.dateModified, basicProperties.size));
                    successCallback(results);
                }, function () {
                    errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
                });
            }, function () {
                errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
            });
        }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); });

    },

    getFormatData: function (successCallback, errorCallback, args) {
        Windows.Storage.StorageFile.getFileFromPathAsync(args[0]).then(
            function (storageFile) {
                var mediaTypeFlag = String(args[1]).split("/")[0].toLowerCase();
                if (mediaTypeFlag === "audio") {
                    storageFile.properties.getMusicPropertiesAsync().then(
                        function (audioProperties) {
                            successCallback(new MediaFileData(null, audioProperties.bitrate, 0, 0, audioProperties.duration / 1000));
                        }, function () {
                            errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
                        }
                    );
                } else if (mediaTypeFlag === "video") {
                    storageFile.properties.getVideoPropertiesAsync().then(
                        function (videoProperties) {
                            successCallback(new MediaFileData(null, videoProperties.bitrate, videoProperties.height, videoProperties.width, videoProperties.duration / 1000));
                        }, function () {
                            errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
                        }
                    );
                } else if (mediaTypeFlag === "image") {
                    storageFile.properties.getImagePropertiesAsync().then(
                        function (imageProperties) {
                            successCallback(new MediaFileData(null, 0, imageProperties.height, imageProperties.width, 0));
                        }, function () {
                            errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
                        }
                    );
                } else {
                    errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
                }
            }, function () {
                errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
            }
        );
    }
};

