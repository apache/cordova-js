/**
 * Encapsulates all audio capture operation configuration options.
 */
var CaptureAudioOptions = function(){
	// Upper limit of sound clips user can record. Value must be equal or greater than 1.
	this.limit = 1;
	// Maximum duration of a single sound clip in seconds.
	this.duration = 0;
	// The selected audio mode. Must match with one of the elements in supportedAudioModes array.
	this.mode = null;
};

module.exports = CaptureAudioOptions;
