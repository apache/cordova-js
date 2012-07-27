/*global WebKitBlobBuilder:false */
var FileEntry = require('cordova/plugin/FileEntry'),
    FileTransferError = require('cordova/plugin/FileTransferError'),
    FileUploadResult = require('cordova/plugin/FileUploadResult');

var nativeResolveLocalFileSystemURI = window.webkitResolveLocalFileSystemURL;

function getParentPath(filePath) {
    var pos = filePath.lastIndexOf('/');
    return filePath.substring(0, pos + 1);
}

function getFileName(filePath) {
    var pos = filePath.lastIndexOf('/');
    return filePath.substring(pos + 1);
}

module.exports = {
    upload: function(successCallback, errorCallback, args) {
        var filePath = args[0],
            server = args[1],
            fileKey = args[2],
            fileName = args[3],
            mimeType = args[4],
            params = args[5],
            /*trustAllHosts = args[6],*/
            chunkedMode = args[7];

        nativeResolveLocalFileSystemURI(filePath, function(entry) {
            entry.file(function(file) {
                function uploadFile(blobFile) {
                    var fd = new FormData();

                    fd.append(fileKey, blobFile, fileName);
                    for (var prop in params) {
                        if(params.hasOwnProperty(prop)) {
                            fd.append(prop, params[prop]);
                        }
                    }

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", server);
                    xhr.onload = function(evt) {
                        if (xhr.status == 200) {
                            var result = new FileUploadResult();
                            result.bytesSent = file.size;
                            result.responseCode = xhr.status;
                            result.response = xhr.response;
                            successCallback(result);
                        } else if (xhr.status == 404) {
                            errorCallback(new FileTransferError(FileTransferError.INVALID_URL_ERR));
                        } else {
                            errorCallback(new FileTransferError(FileTransferError.CONNECTION_ERR));
                        }
                    };
                    xhr.ontimeout = function(evt) {
                        errorCallback(new FileTransferError(FileTransferError.CONNECTION_ERR));
                    };

                    xhr.send(fd);
                }

                var bytesPerChunk;
                if (chunkedMode === true) {
                    bytesPerChunk = 1024 * 1024; // 1MB chunk sizes.
                } else {
                    bytesPerChunk = file.size;
                }
                var start = 0;
                var end = bytesPerChunk;
                while (start < file.size) {
                    var chunk = file.webkitSlice(start, end, mimeType);
                    uploadFile(chunk);
                    start = end;
                    end = start + bytesPerChunk;
                }
            },
            function(error) {
                errorCallback(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR));
            }
            );
        },
        function(error) {
            errorCallback(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR));
        }
        );
    },

    download: function(successCallback, errorCallback, args) {
        var url = args[0],
            filePath = args[1];

        var xhr = new XMLHttpRequest();

        function writeFile(fileEntry) {
            fileEntry.createWriter(function(writer) {
                writer.onwriteend = function(evt) {
                    if (!evt.target.error) {
                        successCallback(new FileEntry(fileEntry.name, fileEntry.toURL()));
                    } else {
                        errorCallback(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR));
                    }
                };

                writer.onerror = function(evt) {
                    errorCallback(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR));
                };

                var builder = new WebKitBlobBuilder();
                builder.append(xhr.response);
                var blob = builder.getBlob();
                writer.write(blob);
            },
            function(error) {
                errorCallback(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR));
            });
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == xhr.DONE) {
                if (xhr.status == 200 && xhr.response) {
                    nativeResolveLocalFileSystemURI(getParentPath(filePath), function(dir) {
                        dir.getFile(getFileName(filePath), {create: true}, writeFile, function(error) {
                            errorCallback(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR));
                        });
                    }, function(error) {
                        errorCallback(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR));
                    });
                } else if (xhr.status == 404) {
                    errorCallback(new FileTransferError(FileTransferError.INVALID_URL_ERR));
                } else {
                    errorCallback(new FileTransferError(FileTransferError.CONNECTION_ERR));
                }
            }
        };

        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.send();
    }
};
