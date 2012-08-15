var MediaFile = require('cordova/plugin/MediaFile');


/**
 * The Capture interface exposes an interface to the camera and microphone of the hosting device.
 */
function Capture() {
    this.supportedAudioModes = [];
    this.supportedImageModes = ["image/jpeg", "image/png"];
    this.supportedVideoModes = ["video/mp4", "video/wmv"];
}

// No UI support. The duration of the audio recording.
var cameraCaptureAudioDuration;
/**
 * Launch audio recorder application for recording audio clip(s).
 *
 * @param {Function} successCB
 * @param {Function} errorCB
 * @param {CaptureAudioOptions} options
 */
Capture.prototype.captureAudio = function (successCallback, errorCallback, options) {
    var audioOptions = new CaptureAudioOptions();
    if (options.duration && options.duration > 0) {
        audioOptions.duration = options.duration;
        cameraCaptureAudioDuration = audioOptions.duration;
    } else {
        errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
        return;
    }
    var mediaCaputreSettings;
    var initCaptureSettings = function () {
        mediaCaputreSettings = null;
        mediaCaputreSettings = new Windows.Media.Capture.MediaCaptureInitializationSettings();
        mediaCaputreSettings.streamingCaptureMode = Windows.Media.Capture.StreamingCaptureMode.audio;
    }
    initCaptureSettings();
    var mediaCapture = new Windows.Media.Capture.MediaCapture();
    mediaCapture.initializeAsync(mediaCaputreSettings).done(function () {
        Windows.Storage.KnownFolders.musicLibrary.createFileAsync("captureAudio.mp3", Windows.Storage.NameCollisionOption.generateUniqueName).then(function (storageFile) {
            var mediaEncodingProfile = new Windows.Media.MediaProperties.MediaEncodingProfile.createMp3(Windows.Media.MediaProperties.AudioEncodingQuality.auto);
            var stopRecord = function () {
                mediaCapture.stopRecordAsync().then(function (result) {
                    storageFile.getBasicPropertiesAsync().then(function (basicProperties) {
                        successCallback(new MediaFile(storageFile.name, storageFile.path, storageFile.contentType, basicProperties.dateModified, basicProperties.size));
                    }, function () {
                        errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
                    })
                }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); })
            }
            mediaCapture.startRecordToStorageFileAsync(mediaEncodingProfile, storageFile).then(function () {
                setTimeout(stopRecord, cameraCaptureAudioDuration * 1000);
            }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); })
        }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); })
    })
};

/**
 * Launch camera application for taking image(s).
 *
 * @param {Function} successCB
 * @param {Function} errorCB
 * @param {CaptureImageOptions} options
 */
Capture.prototype.captureImage = function (successCallback, errorCallback, options) {
    var imageOptions = new CaptureImageOptions();
    var cameraCaptureUI = new Windows.Media.Capture.CameraCaptureUI();
    cameraCaptureUI.photoSettings.allowCropping = true;
    cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.highestAvailable;
    cameraCaptureUI.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.jpeg;
    cameraCaptureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).then(function (file) {
        file.moveAsync(Windows.Storage.KnownFolders.picturesLibrary, "cameraCaptureImage.jpg", Windows.Storage.NameCollisionOption.generateUniqueName).then(function () {
            file.getBasicPropertiesAsync().then(function (basicProperties) {
                successCallback(new MediaFile(file.name, file.path, file.contentType, basicProperties.dateModified, basicProperties.size));
            }, function () {
                errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
            })
        }, function () {
            errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
        });
    }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); })
};

/**
 * Launch device camera application for recording video(s).
 *
 * @param {Function} successCB
 * @param {Function} errorCB
 * @param {CaptureVideoOptions} options
 */
Capture.prototype.captureVideo = function (successCallback, errorCallback, options) {
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
                successCallback(new MediaFile(file.name, file.path, file.contentType, basicProperties.dateModified, basicProperties.size));
            }, function () {
                errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
            })
        }, function () {
            errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
        });
    }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); })
};


module.exports = new Capture();