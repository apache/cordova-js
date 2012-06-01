var DirectoryEntry = require('cordova/plugin/DirectoryEntry'),
    FileEntry = require('cordova/plugin/FileEntry'),
    FileError = require('cordova/plugin/FileError');

/**
 * Look up file system Entry referred to by local URI.
 * @param {DOMString} uri  URI referring to a local file or directory
 * @param successCallback  invoked with Entry object corresponding to URI
 * @param errorCallback    invoked if error occurs retrieving file system entry
 */
module.exports = function(uri, successCallback, errorCallback) {
    // error callback
    var fail = function(error) {
        if (typeof errorCallback === 'function') {
            errorCallback(new FileError(error));
        }
    };
    // if successful, return either a file or directory entry
    var success = function(entry) {
        var result;

        if (entry) {
            if (typeof successCallback === 'function') {
                // create appropriate Entry object
                result = (entry.isDirectory) ? new DirectoryEntry(entry.name, entry.fullPath) : new FileEntry(entry.name, entry.fullPath);
                try {
                    successCallback(result);
                }
                catch (e) {
                    console.log('Error invoking callback: ' + e);
                }
            }
        }
        else {
            // no Entry object returned
            fail(FileError.NOT_FOUND_ERR);
        }
    };
    // pop the parameters if any
    if(uri.indexOf('?')>=0){
        uri = uri.split('?')[0];
    }

    // check for leading /
    if(uri.indexOf('/')==0){
        fail(FileError.ENCODING_ERR);
        return;
    }

    // Entry object is borked - unable to instantiate a new Entry object so just create one
    var theEntry = {};
    if(blackberry.io.dir.exists(uri)){
        theEntry.isDirectory = true;
        theEntry.name = uri.split('/').pop();
        theEntry.fullPath = uri;

        success(theEntry);
    }else if(blackberry.io.file.exists(uri)){
        theEntry.isDirectory = false;
        theEntry.name = uri.split('/').pop();
        theEntry.fullPath = uri;
        success(theEntry);
    }else{
        fail(FileError.NOT_FOUND_ERR);
    }

};
