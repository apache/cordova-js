var requestFileSystem=function(type,size,successCallback,errorCallback) {
    console.error("requestFileSystem");

    var theFileSystem={};
    theFileSystem.name="webOS";
    theFileSystem.root={};
    theFileSystem.root.name="Root";

    theFileSystem.root.getFile=function(filename,options,successCallback,errorCallback) {
        console.error("getFile");
        if (options.create) { errorCallback(); }
        var theFile=filename;
        successCallback(theFile);
    }

    successCallback(theFileSystem);
};

module.exports = requestFileSystem;

