var FileError = require('cordova/plugin/FileError'),
    LocalFileSystem = require('cordova/plugin/LocalFileSystem'),
    Metadata = require('cordova/plugin/Metadata'),
    resolveLocalFileSystemURI = require('cordova/plugin/playbook/resolveLocalFileSystemURI'),
    DirectoryEntry = require('cordova/plugin/DirectoryEntry'),
    FileEntry = require('cordova/plugin/FileEntry'),
    requestFileSystem = require('cordova/plugin/playbook/requestFileSystem');

var recursiveCopy = function(srcDirPath, dstDirPath){
    // get all the contents (file+dir) of the dir
    var files = blackberry.io.dir.listFiles(srcDirPath);
    var dirs = blackberry.io.dir.listDirectories(srcDirPath);

    for(var i=0;i<files.length;i++){
        blackberry.io.file.copy(srcDirPath + '/' + files[i], dstDirPath + '/' + files[i]);
    }

    for(var j=0;j<dirs.length;j++){
        if(!blackberry.io.dir.exists(dstDirPath + '/' + dirs[j])){
            blackberry.io.dir.createNewDir(dstDirPath + '/' + dirs[j]);
        }
        recursiveCopy(srcDirPath + '/' + dirs[j], dstDirPath + '/' + dirs[j]);
    }
};

var validFileRe = new RegExp('^[a-zA-Z][0-9a-zA-Z._ ]*$');

module.exports = {
    getMetadata : function(successCallback, errorCallback){
        var success = typeof successCallback !== 'function' ? null : function(lastModified) {
          var metadata = new Metadata(lastModified);
          successCallback(metadata);
        };
        var fail = typeof errorCallback !== 'function' ? null : function(code) {
          errorCallback(new FileError(code));
        };

        if(this.isFile){
            if(blackberry.io.file.exists(this.fullPath)){
                var theFileProperties = blackberry.io.file.getFileProperties(this.fullPath);
                success(theFileProperties.dateModified);
            }
        }else{
            console.log('Unsupported for directories');
            fail(FileError.INVALID_MODIFICATION_ERR);
        }
    },

    setMetadata : function(successCallback, errorCallback , metadataObject){
        console.log('setMetadata is unsupported for playbook');
    },

    moveTo : function(parent, newName, successCallback, errorCallback){
        var fail = function(code) {
            if (typeof errorCallback === 'function') {
                errorCallback(new FileError(code));
            }
        };
        // user must specify parent Entry
        if (!parent) {
            fail(FileError.NOT_FOUND_ERR);
            return;
        }
        // source path
        var srcPath = this.fullPath,
            // entry name
            name = newName || this.name,
            success = function(entry) {
                if (entry) {
                    if (typeof successCallback === 'function') {
                        // create appropriate Entry object
                        var result = (entry.isDirectory) ? new DirectoryEntry(entry.name, entry.fullPath) : new FileEntry(entry.name, entry.fullPath);
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


        // Entry object is borked
        var theEntry = {};
        var dstPath = parent.fullPath + '/' + name;

        // invalid path
        if(!validFileRe.exec(name)){
            fail(FileError.ENCODING_ERR);
            return;
        }

        if(this.isFile){
            if(srcPath != dstPath){
                if(blackberry.io.file.exists(dstPath)){
                    blackberry.io.file.deleteFile(dstPath);
                    blackberry.io.file.copy(srcPath,dstPath);
                    blackberry.io.file.deleteFile(srcPath);

                    theEntry.fullPath = dstPath;
                    theEntry.name = name;
                    theEntry.isDirectory = false;
                    theEntry.isFile = true;
                    success(theEntry);
                }else if(blackberry.io.dir.exists(dstPath)){
                    // destination path is a directory
                    fail(FileError.INVALID_MODIFICATION_ERR);
                }else{
                    // make sure the directory that we are moving to actually exists
                    if(blackberry.io.dir.exists(parent.fullPath)){
                        blackberry.io.file.copy(srcPath,dstPath);
                        blackberry.io.file.deleteFile(srcPath);

                        theEntry.fullPath = dstPath;
                        theEntry.name = name;
                        theEntry.isDirectory = false;
                        theEntry.isFile = true;
                        success(theEntry);
                    }else{
                        fail(FileError.NOT_FOUND_ERR);
                    }
                }
            }else{
                // file onto itself
                fail(FileError.INVALID_MODIFICATION_ERR);
            }
        }else{
            if(srcPath != dstPath){
                if(blackberry.io.file.exists(dstPath) || srcPath == parent.fullPath){
                    // destination path is either a file path or moving into parent
                    fail(FileError.INVALID_MODIFICATION_ERR);
                }else{
                    if(!blackberry.io.dir.exists(dstPath)){
                        blackberry.io.dir.createNewDir(dstPath);
                        recursiveCopy(srcPath,dstPath);
                        blackberry.io.dir.deleteDirectory(srcPath, true);
                        theEntry.fullPath = dstPath;
                        theEntry.name = name;
                        theEntry.isDirectory = true;
                        theEntry.isFile = false;
                        success(theEntry);
                    }else{
                        var numOfEntries = 0;
                        numOfEntries += blackberry.io.dir.listDirectories(dstPath).length;
                        numOfEntries += blackberry.io.dir.listFiles(dstPath).length;
                        if(numOfEntries === 0){
                            blackberry.io.dir.createNewDir(dstPath);
                            recursiveCopy(srcPath,dstPath);
                            blackberry.io.dir.deleteDirectory(srcPath, true);
                            theEntry.fullPath = dstPath;
                            theEntry.name = name;
                            theEntry.isDirectory = true;
                            theEntry.isFile = false;
                            success(theEntry);
                        }else{
                            // destination directory not empty
                            fail(FileError.INVALID_MODIFICATION_ERR);
                        }
                    }
                }
            }else{
                // directory onto itself
                fail(FileError.INVALID_MODIFICATION_ERR);
            }
        }

    },

    copyTo : function(parent, newName, successCallback, errorCallback) {
        var fail = function(code) {
            if (typeof errorCallback === 'function') {
                errorCallback(new FileError(code));
            }
        };
        // user must specify parent Entry
        if (!parent) {
            fail(FileError.NOT_FOUND_ERR);
            return;
        }
        // source path
        var srcPath = this.fullPath,
            // entry name
            name = newName || this.name,
            success = function(entry) {
                if (entry) {
                    if (typeof successCallback === 'function') {
                        // create appropriate Entry object
                        var result = (entry.isDirectory) ? new DirectoryEntry(entry.name, entry.fullPath) : new FileEntry(entry.name, entry.fullPath);
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

        // Entry object is borked
        var theEntry = {};
        var dstPath = parent.fullPath + '/' + name;

        // invalid path
        if(!validFileRe.exec(name)){
            fail(FileError.ENCODING_ERR);
            return;
        }

        if(this.isFile){
            if(srcPath != dstPath){
                if(blackberry.io.file.exists(dstPath)){
                    if(blackberry.io.dir.exists(dstPath)){
                        blackberry.io.file.copy(srcPath,dstPath);

                        theEntry.fullPath = dstPath;
                        theEntry.name = name;
                        theEntry.isDirectory = false;
                        theEntry.isFile = true;
                        success(theEntry);
                    }else{
                        // destination directory doesn't exist
                        fail(FileError.NOT_FOUND_ERR);
                    }

                }else{
                    blackberry.io.file.copy(srcPath,dstPath);

                    theEntry.fullPath = dstPath;
                    theEntry.name = name;
                    theEntry.isDirectory = false;
                    theEntry.isFile = true;
                    success(theEntry);
                }
            }else{
                // file onto itself
                fail(FileError.INVALID_MODIFICATION_ERR);
            }
        }else{
            if(srcPath != dstPath){
                // allow back up to the root but not child dirs
                if((parent.name != "root" && dstPath.indexOf(srcPath)>=0) || blackberry.io.file.exists(dstPath)){
                    // copying directory into child or is file path
                    fail(FileError.INVALID_MODIFICATION_ERR);
                }else{
                    recursiveCopy(srcPath, dstPath);

                    theEntry.fullPath = dstPath;
                    theEntry.name = name;
                    theEntry.isDirectory = true;
                    theEntry.isFile = false;
                    success(theEntry);
                }
            }else{
                // directory onto itself
                fail(FileError.INVALID_MODIFICATION_ERR);
            }
        }

    },

    remove : function(successCallback, errorCallback) {
        var path = this.fullPath,
            // directory contents
            contents = [];

        var fail = function(error) {
            if (typeof errorCallback === 'function') {
                errorCallback(new FileError(error));
            }
        };

        // file
        if (blackberry.io.file.exists(path)) {
            try {
                blackberry.io.file.deleteFile(path);
                if (typeof successCallback === "function") {
                    successCallback();
                }
            } catch (e) {
                // permissions don't allow
                fail(FileError.INVALID_MODIFICATION_ERR);
            }
        }
        // directory
        else if (blackberry.io.dir.exists(path)) {
            // it is an error to attempt to remove the file system root
            console.log('entry directory');
            // TODO: gotta figure out how to get root dirs on playbook -
            // getRootDirs doesn't work
            if (false) {
                fail(FileError.NO_MODIFICATION_ALLOWED_ERR);
            } else {
                // check to see if directory is empty
                contents = blackberry.io.dir.listFiles(path);
                if (contents.length !== 0) {
                    fail(FileError.INVALID_MODIFICATION_ERR);
                } else {
                    try {
                        // delete
                        blackberry.io.dir.deleteDirectory(path, false);
                        if (typeof successCallback === "function") {
                            successCallback();
                        }
                    } catch (eone) {
                        // permissions don't allow
                        fail(FileError.NO_MODIFICATION_ALLOWED_ERR);
                    }
                }
            }
        }
        // not found
        else {
            fail(FileError.NOT_FOUND_ERR);
        }
    },
    getParent : function(successCallback, errorCallback) {
        var that = this;

        try {
            // On BlackBerry, the TEMPORARY file system is actually a temporary
            // directory that is created on a per-application basis. This is
            // to help ensure that applications do not share the same temporary
            // space. So we check to see if this is the TEMPORARY file system
            // (directory). If it is, we must return this Entry, rather than
            // the Entry for its parent.
            requestFileSystem(LocalFileSystem.TEMPORARY, 0,
                    function(fileSystem) {
                        if (fileSystem.root.fullPath === that.fullPath) {
                            if (typeof successCallback === 'function') {
                                successCallback(fileSystem.root);
                            }
                        } else {
                            resolveLocalFileSystemURI(blackberry.io.dir
                                    .getParentDirectory(that.fullPath),
                                    successCallback, errorCallback);
                        }
                    }, errorCallback);
        } catch (e) {
            if (typeof errorCallback === 'function') {
                errorCallback(new FileError(FileError.NOT_FOUND_ERR));
            }
        }
    }
};

