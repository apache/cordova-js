var FileError = require('cordova/plugin/FileError');

/**
 * An interface that lists the files and directories in a directory.
 */
function DirectoryReader(path) {
    this.path = path || null;
}

/**
 * Returns a list of entries from a directory.
 *
 * @param {Function} successCallback is called with a list of entries
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryReader.prototype.readEntries = function(successCallback, errorCallback) {
    var win = typeof successCallback !== 'function' ? null : function(result) {
        var retVal = [];
        for (var i=0; i<result.length; i++) {
            var entry = null;
            if (result[i].isDirectory) {
                entry = new (require('cordova/plugin/DirectoryEntry'))();
            }
            else if (result[i].isFile) {
                entry = new (require('cordova/plugin/FileEntry'))();
            }
            entry.isDirectory = result[i].isDirectory;
            entry.isFile = result[i].isFile;
            entry.name = result[i].name;
            entry.fullPath = result[i].fullPath;
            retVal.push(entry);
        }
        successCallback(retVal);
    };
    var fail = typeof errorCallback !== 'function' ? null : function(code) {
        errorCallback(new FileError(code));
    };

    var theEntries = [];

    var anEntry = function(isDirectory, name, fullPath){
        this.isDirectory = (isDirectory ? true : false),
        this.isFile = (isDirectory ? false : true),
        this.name = name,
        this.fullPath = fullPath
    };

    if(blackberry.io.dir.exists(this.path)){

        var theDirectories = blackberry.io.dir.listDirectories(this.path)
        var theFiles = blackberry.io.dir.listFiles(this.path);

        var theDirectoriesLength = theDirectories.length;
        var theFilesLength = theFiles.length;
        for(var i=0;i<theDirectoriesLength;i++){
            theEntries.push(new anEntry(true, theDirectories[i], this.path+theDirectories[i]));
        }

        for(var j=0;j<theFilesLength;j++){
            theEntries.push(new anEntry(false, theFiles[j], this.path+theFiles[j]));
        }
        win(theEntries);
    }else{
        fail(FileError.NOT_FOUND_ERR);
    }


};

module.exports = DirectoryReader;
