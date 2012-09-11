/**
 * This class contains information about any Media errors.
*/
/*
 According to :: http://dev.w3.org/html5/spec-author-view/video.html#mediaerror
 We should never be creating these objects, we should just implement the interface
 which has 1 property for an instance, 'code'

 instead of doing :
    errorCallbackFunction( new MediaError(3,'msg') );
we should simply use a literal :
    errorCallbackFunction( {'code':3} );
 */

if(!MediaError) {
    var MediaError = function(code, msg) {
        this.code = (typeof code != 'undefined') ? code : null;
        this.message = msg || ""; // message is NON-standard! do not use!
    };
}

MediaError.MEDIA_ERR_NONE_ACTIVE    = MediaError.MEDIA_ERR_NONE_ACTIVE    || 0;
MediaError.MEDIA_ERR_ABORTED        = MediaError.MEDIA_ERR_ABORTED        || 1;
MediaError.MEDIA_ERR_NETWORK        = MediaError.MEDIA_ERR_NETWORK        || 2;
MediaError.MEDIA_ERR_DECODE         = MediaError.MEDIA_ERR_DECODE         || 3;
MediaError.MEDIA_ERR_NONE_SUPPORTED = MediaError.MEDIA_ERR_NONE_SUPPORTED || 4;
// TODO: MediaError.MEDIA_ERR_NONE_SUPPORTED is legacy, the W3 spec now defines it as below. 
// as defined by http://dev.w3.org/html5/spec-author-view/video.html#error-codes
MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED = MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED || 4;

module.exports = MediaError;
