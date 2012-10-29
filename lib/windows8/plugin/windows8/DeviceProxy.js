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

var cordova = require('cordova');
var utils = require('cordova/utils');


module.exports = {

        getDeviceInfo:function(win,fail,args){
            console.log("NativeProxy::getDeviceInfo");

            var hostNames = Windows.Networking.Connectivity.NetworkInformation.getHostNames();

            var name = "unknown";
            hostNames.some(function (nm) {
                if (nm.displayName.indexOf(".local") > -1) {
                    name = nm.displayName.split(".local")[0];
                    return true;
                }
            });

            // deviceId aka uuid

            var deviceId = "";
            Windows.System.UserProfile.UserInformation.getFirstNameAsync().then(function (fileName) {
                var path = "C:\\Users\\" + fileName + "\\Documents";
                Windows.Storage.StorageFolder.getFolderFromPathAsync(path).then(function (storageFolder) {
                    return storageFolder.createFileAsync("appDeviceIdentifier.txt", Windows.Storage.CreationCollisionOption.openIfExists);
                }).then(function (storageFile) {
                    var value = Windows.Storage.Streams.UnicodeEncoding.utf8;
                    Windows.Storage.FileIO.readTextAsync(storageFile, value).then(function (fileContent) {
                        if (fileContent) {
                            deviceId = fileContent;
                            setTimeout(function () {
                                win({ platform: "windows8", version: "8", name: name, uuid: "TODO", cordova: "2.2.0" });
                            }, 0)
                        } else {
                            deviceId = utils.createUUID();
                            Windows.Storage.FileIO.writeTextAsync(storageFile, deviceId, Windows.Storage.Streams.UnicodeEncoding.utf8).done(
                                function () {
                                    setTimeout(function () {
                                        win({ platform: "windows8", version: "8", name: name, uuid: "TODO", cordova: "2.2.0" });
                                    }, 0)
                                }, function () {
                                    fail(FileError.INVALID_MODIFICATION_ERR);
                                }

                            );
                        }
                    },
                    function () {
                        fail(FileError.ENCODING_ERR);
                    });
                }, function () {
                    fail(FileError.NOT_FOUND_ERR);
                });
                
            }, 
            fail && fail());

        }

        setTimeout(function(){
            win({platform:"windows8", version:"8", name:name, uuid:deviceId, cordova:"2.2.0"});
        },0);
    }

};

require("cordova/commandProxy").add("Device",module.exports);
