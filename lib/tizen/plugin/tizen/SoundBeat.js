/*global webkitAudioContext:false */
/*
 *  SoundBeat
 * used by Notification Manager beep method
 *
 * This class provides sounds play
 *
 * uses W3C  Web Audio API
 * uses BufferLoader object
 *
 * NOTE: the W3C Web Audio doc tells we do not need to recreate the audio
 *       context to play a sound but only the audiosourcenode (createBufferSource)
 *       in the webkit implementation we have to.
 *
 */

var BufferLoader = require('cordova/plugin/tizen/BufferLoader');

function SoundBeat(urlList) {
    this.context = null;
    this.urlList = urlList || null;
    this.buffers = null;
}

/*
 * This method play a loaded sounds on the Device
 * @param {Number} times Number of times to play loaded sounds.
 *
 */
SoundBeat.prototype.play = function(times) {

    var i = 0, sources = [], that = this;

    function finishedLoading (bufferList) {
        that.buffers = bufferList;

        for (i = 0; i < that.buffers.length ; i +=1) {
            if (that.context) {
                sources[i] = that.context.createBufferSource();

                sources[i].buffer = that.buffers[i];
                sources[i].connect (that.context.destination);

                sources[i].loop = true;
                sources[i].noteOn (0);
                sources[i].noteOff(sources[i].buffer.duration * times);
            }
        }
    }

    if (webkitAudioContext !== null) {
        this.context = new webkitAudioContext();
    }
    else {
        console.log ("SoundBeat.prototype.play, w3c web audio api not supported");
        this.context = null;
    }

    if (this.context === null) {
        console.log ("SoundBeat.prototype.play, cannot create audio context object");
        return;
    }

    this.bufferLoader = new BufferLoader (this.context, this.urlList, finishedLoading);
    if (this.bufferLoader === null) {
        console.log ("SoundBeat.prototype.play, cannot create buffer loader object");
        return;
    }

    this.bufferLoader.load();
};

module.exports = SoundBeat;
