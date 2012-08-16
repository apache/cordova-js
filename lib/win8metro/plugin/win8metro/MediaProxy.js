var cordova = require('cordova');

module.exports = {
    mediaCaptureMrg:null,

    // Initiates the audio file
    create:function(win, lose, args) {
        var id = args[0];
        var src = args[1];
        var thisM = Media.get(id);
        Media.onStatus(id, Media.MEDIA_STATE, Media.MEDIA_STARTING);

        Media.prototype.node = null;

        var fn = src.split('.').pop(); // gets the file extension
        if (thisM.node === null) {
            if (fn === 'mp3' || fn === 'wma' || fn === 'wma' ||
                fn === 'cda' || fn === 'adx' || fn === 'wm' ||
                fn === 'm3u' || fn === 'wmx') {
                thisM.node = new Audio(src);
                thisM.node.load();
                var dur = thisM.node.duration;
                if (isNaN(dur)) {
                    dur = -1;
                };
                Media.onStatus(id, Media.MEDIA_DURATION, dur);
            } else {
                lose("Invalid file type");
            }
        }
    },

    // Start playing the audio
    startPlayingAudio:function(win, lose, args) {
        var id = args[0];
        //var src = args[1];
        //var options = args[2];
        Media.onStatus(id, Media.MEDIA_STATE, Media.MEDIA_RUNNING);

        (Media.get(id)).node.play();
    },

    // Stops the playing audio
    stopPlayingAudio:function(win, lose, args) {
        var id = args[0];
        try {
            (Media.get(id)).node.pause();
            (Media.get(id)).node.currentTime = 0;
            Media.onStatus(id, Media.MEDIA_STATE, Media.MEDIA_STOPPED);
            win();
        } catch (err) {
            lose("Failed to stop: "+err);
        };
    },

    // Seeks to the postion in the audio
    seekToAudio:function(win, lose, args) {
        var id = args[0];
        var milliseconds = args[1];
        try {
            (Media.get(id)).node.currentTime = milliseconds / 1000;
            win();
        } catch (err) {
            lose("Failed to seek: "+err);
        };
    },

    // Pauses the playing audio
    pausePlayingAudio:function(win, lose, args) {
        var id = args[0];
        var thisM = Media.get(id);
        try {
            thisM.node.pause();
            Media.onStatus(id, Media.MEDIA_STATE, Media.MEDIA_PAUSED;
        } catch (err) {
            lose("Failed to pause: "+err);
        }
    },

    // Gets current position in the audio
    getCurrentPositionAudio:function(win, lose, args) {
        var id = args[0];
        try {
            var p = (Media.get(id)).node.currentTime;
            Media.onStatus(id, Media.MEDIA_POSITION, p);
            win(p);
        } catch (err) {
            lose(err);
        }
    },

    // Start recording audio
    startRecordingAudio:function(win, lose, args) {
        var id = args[0];
        var src = args[1];
        // Initialize device
        Media.prototype.mediaCaptureMgr = null;
        var thisM = (Media.get(id));
        var captureInitSettings = new Windows.Media.Capture.MediaCaptureInitializationSettings();
        captureInitSettings.streamingCaptureMode = Windows.Media.Capture.StreamingCaptureMode.audio;
        thisM.mediaCaptureMgr = new Windows.Media.Capture.MediaCapture();
        thisM.mediaCaptureMgr.addEventListener("failed", lose);

        thisM.mediaCaptureMgr.initializeAsync(captureInitSettings).done(function (result) {
            thisM.mediaCaptureMgr.addEventListener("recordlimitationexceeded", lose);
            thisM.mediaCaptureMgr.addEventListener("failed", lose);
        }, lose);
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
                    lose("Invalid file type for record");
                    break;
            };
            thisM.mediaCaptureMgr.startRecordToStorageFileAsync(encodingProfile, storageFile).done(win, lose);
        }, lose);
    },

    // Stop recording audio
    stopRecordingAudio:function(win, lose, args) {
        var id = args[0];
        var thisM = Media.get(id);
        thisM.mediaCaptureMgr.stopRecordAsync().done(win, lose);
    },

    // Release the media object
    release:function(win, lose, args) {
        var id = args[0];
        var thisM = Media.get(id);
        try {
            delete thisM.node;
        } catch (err) {
            lose("Failed to release: "+err);
        }
    },
    setVolume:function(win, lose, args) {
        var id = args[0];
        var volume = args[1];
        var thisM = Media.get(id);
        thisM.volume = volume;
    }

    //    Still need code for Media.onStatus
    //        Need to fire event when duration is looked up
    //                                position is looked up
    //                                media is stopped
};
