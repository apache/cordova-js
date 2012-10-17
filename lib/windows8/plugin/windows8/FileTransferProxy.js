/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/


var FileTransferError = require('cordova/plugin/FileTransferError'),
    FileUploadResult = require('cordova/plugin/FileUploadResult'),
    FileEntry = require('cordova/plugin/FileEntry');

module.exports = {

    upload:function(successCallback, error, options) {
        var filePath = options[0];
        var server = options[1];


        var win = function (fileUploadResult) {
            successCallback(fileUploadResult);
        };

        if (filePath === null || typeof filePath === 'undefined') {
            error(FileTransferError.FILE_NOT_FOUND_ERR);
            return;
        }

        if (String(filePath).substr(0, 8) == "file:///") {
            filePath = Windows.Storage.ApplicationData.current.localFolder.path + String(filePath).substr(8).split("/").join("\\");
        }

        Windows.Storage.StorageFile.getFileFromPathAsync(filePath).then(function (storageFile) {
            storageFile.openAsync(Windows.Storage.FileAccessMode.read).then(function (stream) {
                var blob = MSApp.createBlobFromRandomAccessStream(storageFile.contentType, stream);
                var formData = new FormData();
                formData.append("source\";filename=\"" + storageFile.name + "\"", blob);
                WinJS.xhr({ type: "POST", url: server, data: formData }).then(function (response) {
                    var code = response.status;
                    storageFile.getBasicPropertiesAsync().done(function (basicProperties) {

                        Windows.Storage.FileIO.readBufferAsync(storageFile).done(function (buffer) {
                            var dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                            var fileContent = dataReader.readString(buffer.length);
                            dataReader.close();
                            win(new FileUploadResult(basicProperties.size, code, fileContent));

                        });

                    });
                }, function () {
                    error(FileTransferError.INVALID_URL_ERR);
                });
            });

        },function(){error(FileTransferError.FILE_NOT_FOUND_ERR);});
    },

    download:function(win, error, options) {
        var source = options[0];
        var target = options[1];


        if (target === null || typeof target === undefined) {
            error(FileTransferError.FILE_NOT_FOUND_ERR);
            return;
        }
        if (String(target).substr(0, 8) == "file:///") {
            target = Windows.Storage.ApplicationData.current.localFolder.path + String(target).substr(8).split("/").join("\\");
        }
        var path = target.substr(0, String(target).lastIndexOf("\\"));
        var fileName = target.substr(String(target).lastIndexOf("\\") + 1);
        if (path === null || fileName === null) {
            error(FileTransferError.FILE_NOT_FOUND_ERR);
            return;
        }

        var download = null;


        Windows.Storage.StorageFolder.getFolderFromPathAsync(path).then(function (storageFolder) {
            storageFolder.createFileAsync(fileName, Windows.Storage.CreationCollisionOption.generateUniqueName).then(function (storageFile) {
                var uri = Windows.Foundation.Uri(source);
                var downloader = new Windows.Networking.BackgroundTransfer.BackgroundDownloader();
                download = downloader.createDownload(uri, storageFile);
                download.startAsync().then(function () {
                    win(new FileEntry(storageFile.name, storageFile.path));
                }, function () {
                    error(FileTransferError.INVALID_URL_ERR);
                });
            });
        });
    }
};

require("cordova/commandProxy").add("FileTransfer",module.exports);
