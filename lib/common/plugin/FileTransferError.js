/**
 * FileTransferError
 * @constructor
 */
var FileTransferError = function(code) {
    this.code = code || null;
};

FileTransferError.FILE_NOT_FOUND_ERR = 1;
FileTransferError.INVALID_URL_ERR = 2;
FileTransferError.CONNECTION_ERR = 3;

module.exports = FileTransferError;