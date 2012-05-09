var FileEntry = require('cordova/plugin/FileEntry')
    Entry = require('cordova/plugin/playbook/Entry'),
    FileWriter = require('cordova/plugin/playbook/FileWriter'),
    File = require('cordova/plugin/playbook/File'),
    FileError = require('cordova/plugin/FileError');

module.exports = {
    /**
     * Creates a new FileWriter associated with the file that this FileEntry represents.
     *
     * @param {Function} successCallback is called with the new FileWriter
     * @param {Function} errorCallback is called with a FileError
     */
    createWriter : function(successCallback, errorCallback) {
        this.file(function(filePointer) {
            var writer = new FileWriter(filePointer);

            if (writer.fileName === null || writer.fileName === "") {
                if (typeof errorCallback === "function") {
                    errorCallback(new FileError(FileError.INVALID_STATE_ERR));
                }
            } else {
                if (typeof successCallback === "function") {
                    successCallback(writer);
                }
            }
        }, errorCallback);
    },

    /**
     * Returns a File that represents the current state of the file that this FileEntry represents.
     *
     * @param {Function} successCallback is called with the new File object
     * @param {Function} errorCallback is called with a FileError
     */
    file : function(successCallback, errorCallback) {
        var win = typeof successCallback !== 'function' ? null : function(f) {
            var file = new File(f.name, f.fullPath, f.type, f.lastModifiedDate, f.size);
            successCallback(file);
        };
        var fail = typeof errorCallback !== 'function' ? null : function(code) {
            errorCallback(new FileError(code));
        };
        console.log('getting file properties');
        // TODO Need to set up win/fail callbacks
        var theFileProperties = blackberry.io.file.getFileProperties(this.fullPath);
        var theFile = {};
        console.log(this.fullPath);
        console.log(this.name);
        //theFile.name =
        theFile.fullPath = this.fullPath;
        theFile.type = theFileProperties.fileExtension;
        theFile.lastModifiedDate = theFileProperties.dateModified;
        theFile.size = theFileProperties.size;
        win(theFile);
        //exec(win, fail, "File", "getFileMetadata", [this.fullPath]);
    }
};

