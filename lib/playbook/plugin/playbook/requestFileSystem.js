var DirectoryEntry = require('cordova/plugin/DirectoryEntry'),
FileError = require('cordova/plugin/FileError'),
FileSystem = require('cordova/plugin/FileSystem'),
LocalFileSystem = require('cordova/plugin/LocalFileSystem');

/**
 * Request a file system in which to store application data.
 * @param type  local file system type
 * @param size  indicates how much storage space, in bytes, the application expects to need
 * @param successCallback  invoked with a FileSystem object
 * @param errorCallback  invoked if error occurs retrieving file system
 */
var requestFileSystem = function(type, size, successCallback, errorCallback) {
    var fail = function(code) {
        if (typeof errorCallback === 'function') {
            errorCallback(new FileError(code));
        }
    };

    if (type < 0 || type > 3) {
        fail(FileError.SYNTAX_ERR);
    } else {
        // if successful, return a FileSystem object
        var success = function(file_system) {
            if (file_system) {
                if (typeof successCallback === 'function') {
                    successCallback(file_system);
                }
            }
            else {
                // no FileSystem object returned
                fail(FileError.NOT_FOUND_ERR);
            }
        };

        // blackberry.io.dir.getFreeSpaceForRoot is undefined despite being documented otherwise
        // no real way of checking for max file size at the moment it seems
        /*
        if(size>=1000000000000000){
            fail(FileError.QUOTA_EXCEEDED_ERR);
        }
        */

        var theFileSystem;
        try{
            // is there a way to get space for the app that doesn't point to the appDirs folder?
            if(type==LocalFileSystem.TEMPORARY){
                theFileSystem = new FileSystem('temporary', new DirectoryEntry('root', blackberry.io.dir.appDirs.app.storage.path));
            }else if(type==LocalFileSystem.PERSISTENT){
                theFileSystem = new FileSystem('persistent', new DirectoryEntry('root', blackberry.io.dir.appDirs.app.storage.path));
            }
            success(theFileSystem);
        }catch(e){
            fail(FileError.SYNTAX_ERR);
        }
    }
};
module.exports = requestFileSystem;
