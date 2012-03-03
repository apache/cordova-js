/**
 *  CompassError.
 *  An error code assigned by an implementation when an error has occured
 * @constructor
 */
var CompassError = function(err) {
    this.code = (typeof err != 'undefined' ? err : null);
};

/**
 * Error codes
 */
CompassError.COMPASS_INTERNAL_ERR = 0;
CompassError.COMPASS_NOT_SUPPORTED = 20;

module.exports = CompassError;

