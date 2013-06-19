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
    modulemapper = require('cordova/modulemapper'),
    origOpen = modulemapper.getOriginalSymbol(window, 'open'),
    browser = {
        close: function () { } //dummy so we don't have to check for undefined
    };

var navigate = {
    "_blank": function (url, whitelisted) {
        return origOpen(url, "_blank");
    },

    "_self": function (url, whitelisted) {
        if (whitelisted) {
            window.location.href = url;
            return window;
        }
        else {
            return origOpen(url, "_blank");
        }
    },

    "_system": function (url, whitelisted) {
        blackberry.invoke.invoke({
            target: "sys.browser",
            uri: url
        }, function () {}, function () {});

        return {
            close: function () { }
        };
    }
};

module.exports = {
    open: function (args, win, fail) {
        var url = args[0],
            target = args[1] || '_self',
            a = document.createElement('a');

        //Make all URLs absolute
        a.href = url;
        url = a.href;

        switch (target) {
        case '_self':
        case '_system':
        case '_blank':
            break;
        default:
            target = '_blank';
            break;
        }

        cordova.exec(function (whitelisted) {
            browser = navigate[target](url, whitelisted);
        }, fail, "org.apache.cordova", "isWhitelisted", [url], true);

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "" };
    },
    close: function (args, win, fail) {
        browser.close();
        return { "status" : cordova.callbackStatus.OK, "message" : "" };
    }
};
