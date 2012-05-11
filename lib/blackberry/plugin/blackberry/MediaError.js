
// The MediaError object exists on BB OS 6+ which prevents the Cordova version
// being defined. This object is used to merge in differences between the BB
// MediaError object and the Cordova version.
module.exports = {
        MEDIA_ERR_NONE_ACTIVE : 0,
        MEDIA_ERR_NONE_SUPPORTED : 4
};