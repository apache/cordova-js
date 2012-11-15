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

module.exports = {
    download: function (args, win, fail) {
        var source = args[0],
            target = args[1];

        blackberry.io.filetransfer.download(source, target, win, fail);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    upload: function (args, win, fail) {
        var path = args[0],
            server = args[1],
            options = {
                fileKey: args[2],
                fileName: args[3],
                mimeType: args[4],
                params: args[5],
                chunkedMode: args[6]
            };

        blackberry.io.filetransfer.upload(path, server, win, fail, options);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    }
};
