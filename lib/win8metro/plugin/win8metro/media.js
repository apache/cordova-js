/*
    Notes
    Windows 8 supports by default mp3, wav, wma, cda, adx, wm, m3u, and wmx. This
    can be expanded on by installing new codecs, but Media.prototype.play() needs
    to updated. 
    ##Todo
    find better method to implement filetype checking to allow for installed codecs
    record audio
    implement more error checking
*/

// Object to represnt a media error
function MediaError(code, message) {
    this.code = code || null;
    this.message = message || null;
}

// Values defined by W3C spec for HTML5 audio
MediaError.MEDIA_ERR_NONE_ACTIVE = 0;
MediaError.MEDIA_ERR_ABORTED = 1;
MediaError.MEDIA_ERR_NETWORK = 2;
MediaError.MEDIA_ERR_DECODE = 3;
MediaError.MEDIA_ERR_NONE_SUPPORTED = 4;

function Media(src, mediaSuccess, mediaError, mediaStatus) {
    this.id = createUUID();

    this.src = src;

    this.mediaSuccess = mediaSuccess || null;

    this.mediaError = mediaError || null;

    this.mediaStatus = mediaStatus || null;

    this._position = 0;

    this._duration = -1;

    // Private variable used to identify the audio
    this.node = null;
    this.mediaCaptureMgr = null;

};

// Returns the current position within an audio file
Media.prototype.getCurrentPosition = function (success, failure) {
    this._position = this.node.currentTime;
    success(this._position);
};

// Returns the duration of an audio file
Media.prototype.getDuration = function () {
    this._duration = this.node.duration;
    return this._duration;
};

// Starts or resumes playing an audio file.
Media.prototype.play = function () {
    this.node = new Audio(this.src);
    var filename = this.src.split('.').pop(); // get the file extension

    if (filename === 'mp3' ||
        filename === 'wav' ||
        filename === 'wma' ||
        filename === 'cda' ||
        filename === 'adx' ||
        filename === 'wm' ||
        filename === 'm3u' ||
        filename === 'wmx') {  // checks to see if file extension is correct
        if (this.node === null) {
            this.node.load();
            this._duration = this.node.duration;
        };
        this.node.play();
    } else {
        //invalid file name
        this.mediaError(new MediaError(MediaError.MEDIA_ERR_ABORTED, "Invalid file name"));
    };
};

// Pauses playing an audio file.
Media.prototype.pause = function () {
    if (this.node) {
        this.node.pause();
    }
};

// Releases the underlying operating systems audio resources.
Media.prototype.release = function () {
    delete node;
};

// Sets the current position within an audio file.
Media.prototype.seekTo = function (milliseconds) {
    if (this.node) {
        this.node.currentTime = milliseconds / 1000;
        this.getCurrentPosition();
    }
};

// Starts recording an audio file.
Media.prototype.startRecord = function () {
    // Initialize device
    var captureInitSettings = new Windows.Media.Capture.MediaCaptureInitializationSettings();
    captureInitSettings.streamingCaptureMode = Windows.Media.Capture.StreamingCaptureMode.audio;
    this.mediaCaptureMgr = new Windows.Media.Capture.MediaCapture();
    this.mediaCaptureMgr.addEventListener("failed", mediaError);

    this.mediaCaptureMgr.initializeAsync(captureInitSettings).done(function (result) {
        this.mediaCaptureMgr.addEventListener("recordlimitationexceeded", mediaError);
        this.mediaCaptureMgr.addEventListener("failed", mediaError);
    }, mediaError);
    // Start recording
    Windows.Storage.KnownFolders.musicLibrary.createFileAsync(src, Windows.Storage.CreationCollisionOption.replaceExisting).done(function (newFile) {
        var storageFile = newFile;
        var fileType = this.src.split('.').pop();
        var encodingProfile = null;
        switch (fileType) {
            case 'm4a':
                encodingProfile = Windows.Media.MediaProperties.MediaEncodingProfile.createM4a(Windows.Media.MediaProperties.AudioEncodingQuality.auto);
                break;
            case 'mp3':
                encodingProfile = Windows.Media.MediaProperties.MediaEncodingProfile.createMp3(Windows.Media.MediaProperties.AudioEncodingQuality.auto);
                break;
            case 'wma':
                encodingProfile = Windows.Media.MediaProperties.MediaEncodingProfile.createWma(Windows.Media.MediaProperties.AudioEncodingQuality.auto);
                break;
            default:
                mediaError();
                break;
        };
        this.mediaCaptureMgr.startRecordToStorageFileAsync(encodingProfile, storageFile).done(function (result) { }, mediaError);
    }, mediaError);
};

// Stops recording an audio file.
Media.prototype.stopRecord = function () {
    this.mediaCaptureMgr.stopRecordAsync().done(mediaSuccess, mediaError);

};

// Stops playing an audio file.
Media.prototype.stop = function () {
    if (this._position > 0) {
        this.node.pause();
        this.node.currentTime = 0;
        this._position = this.node.currentTime;
    }
};