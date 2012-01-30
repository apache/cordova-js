var exec = require('phonegap/exec');

/**
 * Represents a local file system.
 */
var LocalFileSystem = function() {

};

// Non-standard function
LocalFileSystem.prototype.isFileSystemRoot = function(path) {
    return exec(null, null, "File", "isFileSystemRoot", [path]);
};

LocalFileSystem.TEMPORARY = 0; //temporary, with no guarantee of persistence
LocalFileSystem.PERSISTENT = 1; //persistent

module.exports = LocalFileSystem;
