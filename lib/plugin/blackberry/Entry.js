var FileError = require('phonegap/plugin/FileError'),
    LocalFileSystem = require('phonegap/plugin/LocalFileSystem');

module.exports = {
  remove:function(successCallback, errorCallback) {
    var path = this.fullPath,
        // directory contents
        contents = [];
    
    // file
    if (blackberry.io.file.exists(path)) {
        try {
            blackberry.io.file.deleteFile(path);
            if (typeof successCallback === "function") {
                successCallback();
            }                
        }
        catch (e) {
            // permissions don't allow
            errorCallback(new FileError(FileError.INVALID_MODIFICATION_ERR));
        }
    }
    // directory
    else if (blackberry.io.dir.exists(path)) {
        // it is an error to attempt to remove the file system root
        if (LocalFileSystem.isFileSystemRoot(path)) {
            errorCallback(new FileError(FileError.NO_MODIFICATION_ALLOWED_ERR));
        }
        else {
            // check to see if directory is empty
            contents = blackberry.io.dir.listFiles(path);
            if (contents.length !== 0) {
                errorCallback(new FileError(FileError.INVALID_MODIFICATION_ERR));
            }
            else {
                try {
                    // delete
                    blackberry.io.dir.deleteDirectory(path, false);
                    if (typeof successCallback === "function") {
                        successCallback();
                    }
                }
                catch (eone) {
                    // permissions don't allow
                    errorCallback(new FileError(FileError.NO_MODIFICATION_ALLOWED_ERR));
                }
            }
        }
    }
    // not found
    else {
        errorCallback(new FileError(FileError.NOT_FOUND_ERR));
    }
  }
};
