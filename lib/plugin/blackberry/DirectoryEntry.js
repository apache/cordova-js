var DirectoryEntry = require('phonegap/plugin/DirectoryEntry'),
    FileError = require('phonegap/plugin/FileError');

/**
 * Creates or looks up a directory; override for BlackBerry.
 * 
 * @param path
 *            {DOMString} either a relative or absolute path from this
 *            directory in which to look up or create a directory
 * @param options
 *            {Flags} options to create or exclusively create the
 *            directory
 * @param successCallback
 *            {Function} called with the new DirectoryEntry
 * @param errorCallback
 *            {Function} called with a FileError
 */
var DirectoryEntry = {
  getDirectory:function(path, options, successCallback, errorCallback) {
        // create directory if it doesn't exist
    var create = (options && options.create === true) ? true : false,
        // if true, causes failure if create is true and path already exists
        exclusive = (options && options.exclusive === true) ? true : false,
        // directory exists
        exists,
        // create a new DirectoryEntry object and invoke success callback
        createEntry = function() {
            var path_parts = path.split('/'),
                name = path_parts[path_parts.length - 1],
                dirEntry = new DirectoryEntry({name: name, 
                    isDirectory: true, isFile: false, fullPath: path});
        
            // invoke success callback
            if (typeof successCallback === 'function') {
                successCallback(dirEntry);
            }
        };
        
    // determine if path is relative or absolute
    if (!path) {
        errorCallback(new FileError(FileError.ENCODING_ERR));
        return;
    } 
    else if (path.indexOf(this.fullPath) !== 0) {
        // path does not begin with the fullPath of this directory
        // therefore, it is relative
        path = this.fullPath + '/' + path;
    }
    
    // determine if directory exists
    try {
        // will return true if path exists AND is a directory
        exists = blackberry.io.dir.exists(path);
    }
    catch (e) {
        // invalid path
        errorCallback(new FileError(FileError.ENCODING_ERR));
        return;
    }
    
    // path is a directory
    if (exists) {
        if (create && exclusive) {
            // can't guarantee exclusivity
            errorCallback(new FileError(FileError.PATH_EXISTS_ERR));
        }
        else {
            // create entry for existing directory
            createEntry();                
        }
    }
    // will return true if path exists AND is a file
    else if (blackberry.io.file.exists(path)) {
        // the path is a file
        errorCallback(new FileError(FileError.TYPE_MISMATCH_ERR));
    }
    // path does not exist, create it
    else if (create) {
        try {
            // directory path must have trailing slash
            var dirPath = path;
            if (dirPath.substr(-1) !== '/') {
                dirPath += '/';
            }
            blackberry.io.dir.createNewDir(dirPath);
            createEntry();
        }
        catch (eone) {
            // unable to create directory
            errorCallback(new FileError(FileError.NOT_FOUND_ERR));
        }
    }
    // path does not exist, don't create
    else {
        // directory doesn't exist
        errorCallback(new FileError(FileError.NOT_FOUND_ERR));
    }             
  }
};
