var exec = require('phonegap/exec'),
    LocalFileSystem = require('phonegap/plugin/LocalFileSystem'),
    FileError = require('phonegap/plugin/FileError'),
    requestFileSystem = require('phonegap/plugin/requestFileSystem'),
    Metadata = require('phonegap/plugin/Metadata');

/**
 * Represents a file or directory on the local file system.
 * 
 * @param isFile
 *            {boolean} true if Entry is a file (readonly)
 * @param isDirectory
 *            {boolean} true if Entry is a directory (readonly)
 * @param name
 *            {DOMString} name of the file or directory, excluding the path
 *            leading to it (readonly)
 * @param fullPath
 *            {DOMString} the absolute full path to the file or directory
 *            (readonly)
 */
function Entry(isFile, isDirectory, name, fullPath) {
    this.isFile = (typeof isFile != 'undefined'?isFile:false);
    this.isDirectory = (typeof isDirectory != 'undefined'?isDirectory:false);
    this.name = name || '';
    this.fullPath = fullPath || '';
}

/**
 * Look up the metadata of the entry.
 * 
 * @param successCallback
 *            {Function} is called with a Metadata object
 * @param errorCallback
 *            {Function} is called with a FileError
 */
Entry.prototype.getMetadata = function(successCallback, errorCallback) {
  var success = function(lastModified) {
      var metadata = new Metadata(lastModified);
      successCallback(metadata);
  };
      
  exec(success, errorCallback, "File", "getMetadata", [this.fullPath]);
};

/**
 * Move a file or directory to a new location.
 * 
 * @param parent
 *            {DirectoryEntry} the directory to which to move this entry
 * @param newName
 *            {DOMString} new name of the entry, defaults to the current name
 * @param successCallback
 *            {Function} called with the new DirectoryEntry object
 * @param errorCallback
 *            {Function} called with a FileError
 */
Entry.prototype.moveTo = function(parent, newName, successCallback, errorCallback) {
    // source path
    var srcPath = this.fullPath,
        // entry name
        name = newName || this.name,
        // destination path
        dstPath,
        success = function(entry) {
            var result; 

            if (entry) {
                // create appropriate Entry object
                result = (entry.isDirectory) ? new require('phonegap/plugin/DirectoryEntry')(entry) : new require('phonegap/plugin/FileEntry')(entry);                
                try {
                    successCallback(result);
                }
                catch (e) {
                    console.log('Error invoking callback: ' + e);
                }
            } 
            else {
                // no Entry object returned
                errorCallback(new FileError(FileError.NOT_FOUND_ERR));
            }
        };

    // user must specify parent Entry
    if (!parent) {
        errorCallback(new FileError(FileError.NOT_FOUND_ERR));
        return;
    }

    // copy
    exec(success, errorCallback, "File", "moveTo", [srcPath, parent.fullPath, name]);
};

/**
 * Copy a directory to a different location.
 * 
 * @param parent 
 *            {DirectoryEntry} the directory to which to copy the entry
 * @param newName 
 *            {DOMString} new name of the entry, defaults to the current name
 * @param successCallback
 *            {Function} called with the new Entry object
 * @param errorCallback
 *            {Function} called with a FileError
 */
Entry.prototype.copyTo = function(parent, newName, successCallback, errorCallback) {
        // source path
    var srcPath = this.fullPath,
        // entry name
        name = newName || this.name,
        // success callback
        success = function(entry) {
            var result; 

            if (entry) {
                // create appropriate Entry object
                result = (entry.isDirectory) ? new require('phonegap/plugin/DirectoryEntry')(entry) : new require('phonegap/plugin/FileEntry')(entry);                
                try {
                    successCallback(result);
                }
                catch (e) {
                    console.log('Error invoking callback: ' + e);
                }         
            } 
            else {
                // no Entry object returned
                errorCallback(new FileError(FileError.NOT_FOUND_ERR));
            }
        };

    // user must specify parent Entry
    if (!parent) {
        errorCallback(new FileError(FileError.NOT_FOUND_ERR));
        return;
    }

    // copy
    exec(success, fail, "File", "copyTo", [srcPath, parent.fullPath, name]);
};

/**
 * Return a URL that can be used to identify this entry.
 * 
 * @param mimeType
 *            {DOMString} for a FileEntry, the mime type to be used to
 *            interpret the file, when loaded through this URI.
 * @param successCallback
 *            {Function} called with the new Entry object
 * @param errorCallback
 *            {Function} called with a FileError
 */
Entry.prototype.toURL = function(mimeType, successCallback, errorCallback) {
    // fullPath attribute contains the full URL
    return this.fullPath;
};    

/**
 * Remove a file or directory. It is an error to attempt to delete a
 * directory that is not empty. It is an error to attempt to delete a
 * root directory of a file system.
 * 
 * @param successCallback {Function} called with no parameters
 * @param errorCallback {Function} called with a FileError
 */
Entry.prototype.remove = function(successCallback, errorCallback) {
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
            LocalFileSystem.onError(FileError.INVALID_MODIFICATION_ERR, errorCallback);                
        }
    }
    // directory
    else if (blackberry.io.dir.exists(path)) {
        // it is an error to attempt to remove the file system root
        if (LocalFileSystem.isFileSystemRoot(path)) {
            LocalFileSystem.onError(FileError.NO_MODIFICATION_ALLOWED_ERR, errorCallback);
        }
        else {
            // check to see if directory is empty
            contents = blackberry.io.dir.listFiles(path);
            if (contents.length !== 0) {
                LocalFileSystem.onError(FileError.INVALID_MODIFICATION_ERR, errorCallback);
            }
            else {
                try {
                    // delete
                    blackberry.io.dir.deleteDirectory(path, false);
                    if (typeof successCallback === "function") {
                        successCallback();
                    }
                }
                catch (e) {
                    // permissions don't allow
                    LocalFileSystem.onError(FileError.NO_MODIFICATION_ALLOWED_ERR, errorCallback);
                }
            }
        }
    }
    // not found
    else {
        LocalFileSystem.onError(FileError.NOT_FOUND_ERR, errorCallback);
    }
};

/**
 * Look up the parent DirectoryEntry of this entry.
 * 
 * @param successCallback {Function} called with the parent DirectoryEntry object
 * @param errorCallback {Function} called with a FileError
 */
Entry.prototype.getParent = function(successCallback, errorCallback) {
    var that = this;
    
    try {
        // On BlackBerry, the TEMPORARY file system is actually a temporary 
        // directory that is created on a per-application basis.  This is
        // to help ensure that applications do not share the same temporary
        // space.  So we check to see if this is the TEMPORARY file system
        // (directory).  If it is, we must return this Entry, rather than
        // the Entry for its parent.
        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
                function(fileSystem) {                        
                    if (fileSystem.root.fullPath === that.fullPath) {
                        successCallback(fileSystem.root);
                    }
                    else {
                        window.resolveLocalFileSystemURI(
                                blackberry.io.dir.getParentDirectory(that.fullPath), 
                                successCallback, 
                                errorCallback);
                    }
                },
                function (error) {
                    LocalFileSystem.onError(error, errorCallback);
                });
    } 
    catch (e) {
        // FIXME: need a generic error code
        LocalFileSystem.onError(FileError.NOT_FOUND_ERR, errorCallback);
    }
};

module.exports = Entry;
