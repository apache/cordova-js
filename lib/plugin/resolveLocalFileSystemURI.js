var DirectoryEntry = require('phonegap/plugin/DirectoryEntry'),
    FileEntry = require('phonegap/plugin/FileEntry'),
    exec = require('phonegap/exec');

/**
 * Look up file system Entry referred to by local URI.
 * @param {DOMString} uri  URI referring to a local file or directory 
 * @param successCallback  invoked with Entry object corresponding to URI
 * @param errorCallback    invoked if error occurs retrieving file system entry
 */
module.exports = function(uri, successCallback, errorCallback) {
    // if successful, return either a file or directory entry
    var success = function(entry) {
        var result; 

        if (entry) {
            // create appropriate Entry object
            result = (entry.isDirectory) ? new DirectoryEntry(entry) : new FileEntry(entry);                
            try {
                successCallback(result);
            }
            catch (e) {
                console.log('Error invoking callback: ' + e);
            }         
        } 
        else {
            // no Entry object returned
            fail(FileError.NOT_FOUND_ERR);
        }
    };

    // error callback
    var fail = function(error) {
        errorCallback(new FileError(error));
    };
    exec(success, fail, "File", "resolveLocalFileSystemURI", [uri]);
};   
