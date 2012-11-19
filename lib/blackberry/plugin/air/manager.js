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

var cordova = require('cordova'),
    plugins = {
        'Device' : require('cordova/plugin/air/device'),
        'Battery' : require('cordova/plugin/air/battery'),
        'Camera' : require('cordova/plugin/air/camera'),
        'Logger' : require('cordova/plugin/webworks/logger'),
        'Media' : require('cordova/plugin/webworks/media'),
        'Capture' : require('cordova/plugin/air/capture'),
        'Accelerometer' : require('cordova/plugin/webworks/accelerometer'),
        'NetworkStatus' : require('cordova/plugin/air/network'),
        'Notification' : require('cordova/plugin/webworks/notification'),
        'FileTransfer' : require('cordova/plugin/air/FileTransfer')
    };

module.exports = {
    addPlugin: function (key, module) {
        plugins[key] = require(module);
    },
    exec: function (win, fail, clazz, action, args) {
        var result = {"status" : cordova.callbackStatus.CLASS_NOT_FOUND_EXCEPTION, "message" : "Class " + clazz + " cannot be found"};

        if (plugins[clazz]) {
            if (plugins[clazz][action]) {
                result = plugins[clazz][action](args, win, fail);
            }
            else {
                result = { "status" : cordova.callbackStatus.INVALID_ACTION, "message" : "Action not found: " + action };
            }
        }

        return result;
    },
    resume: function () {},
    pause: function () {},
    destroy: function () {}
};
