var cordova = require('cordova'),
FileTransferError = require('cordova/plugin/FileTransferError'),
FileUploadResult = require('cordova/plugin/FileUploadResult');

var validURLProtocol = new RegExp('^(https?|ftp):\/\/');

function getParentPath(filePath) {
    var pos = filePath.lastIndexOf('/');
    return filePath.substring(0, pos + 1);
}

function getFileName(filePath) {
    var pos = filePath.lastIndexOf('/');
    return filePath.substring(pos + 1);
}

module.exports = {
    upload: function (args, win, fail) {
        var filePath = args[0],
            server = args[1],
            fileKey = args[2],
            fileName = args[3],
            mimeType = args[4],
            params = args[5],
            trustAllHosts = args[6],
            chunkedMode = args[7],
            headers = args[8];

        if(!validURLProtocol.exec(server)){
            return { "status" : cordova.callbackStatus.ERROR, "message" : new FileTransferError(FileTransferError.INVALID_URL_ERR) };
        }

        window.resolveLocalFileSystemURI(filePath, fileWin, fail);

        function fileWin(entryObject){
            blackberry.io.file.readFile(filePath, readWin, false);
        }

        function readWin(filePath, blobFile){
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
                    result.bytesSent = xhr.response.length;
                    result.responseCode = xhr.status;
                    result.response = xhr.response;
                    win(result);
                } else if (xhr.status == 404) {
                    fail(new FileTransferError(FileTransferError.INVALID_URL_ERR, null, null, xhr.status));
                } else if (xhr.status == 403) {
                    fail(new FileTransferError(FileTransferError.INVALID_URL_ERR, null, null, xhr.status));
                } else {
                    fail(new FileTransferError(FileTransferError.CONNECTION_ERR, null, null, xhr.status));
                }
            };
            xhr.ontimeout = function(evt) {
                fail(new FileTransferError(FileTransferError.CONNECTION_ERR, null, null, xhr.status));
            };

            if(headers){
                for(var i in headers){
                    xhr.setRequestHeader(i, headers[i]);
                }
            }
            xhr.send(fd);
        }

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },

    download: function(args, win, fail){
        var url = args[0],
            filePath = args[1];

        if(!validURLProtocol.exec(url)){
            return { "status" : cordova.callbackStatus.ERROR, "message" : new FileTransferError(FileTransferError.INVALID_URL_ERR) };
        }

        var xhr = new XMLHttpRequest();

        function writeFile(fileEntry) {
            fileEntry.createWriter(function(writer) {
                writer.onwriteend = function(evt) {
                    if (!evt.target.error) {
                        win(new window.FileEntry(fileEntry.name, fileEntry.toURL()));
                    } else {
                        fail(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR));
                    }
                };

                writer.onerror = function(evt) {
                    fail(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR));
                };

                var blob = blackberry.utils.stringToBlob(xhr.response);
                writer.write(blob);

            },
            function(error) {
                fail(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR));
            });
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == xhr.DONE) {
                if (xhr.status == 200 && xhr.response) {
                    window.resolveLocalFileSystemURI(getParentPath(filePath), function(dir) {
                        dir.getFile(getFileName(filePath), {create: true}, writeFile, function(error) {
                            fail(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR));
                        });
                    }, function(error) {
                        fail(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR));
                    });
                } else if (xhr.status == 404) {
                    fail(new FileTransferError(FileTransferError.INVALID_URL_ERR, null, null, xhr.status));
                } else {
                    fail(new FileTransferError(FileTransferError.CONNECTION_ERR, null, null, xhr.status));
                }
            }
        };

        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.send();

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    }
};
