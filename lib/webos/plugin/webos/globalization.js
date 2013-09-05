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

var service = require('cordova/plugin/webos/service');

module.exports = {
    getPreferredLanguage: function(successCallback, errorCallback) {
        // get a languageCode (e.g. en)
        service.request('palm://com.palm.systemservice', {
            method: 'getPreferences',
            parameters: {
                'keys': ['locale']
            },
            onSuccess: function(inResponse) {
                var languageCode = inResponse.locale.languageCode;
                // get a languageName (e.g. English) from the languageCode
                service.request('palm://com.palm.systemservice', {
                    method: 'getPreferenceValues',
                    parameters: {
                        'key': 'locale'
                    },
                    onSuccess: function(inResponse) {
                        var locale = inResponse.locale;
                        for (var i = 0, max = locale.length; i < max; i++) {
                            if (locale[i].languageCode == languageCode) {
                                successCallback(locale[i].languageName);
                            }
                        }
                    },
                    // return a languageCode when a request fails
                    onFailure: function(inError) {
                        successCallback(languageCode);
                    }
                });
            },
            onFailure: errorCallback
        });
    },
    getLocaleName: function(successCallback, errorCallback) {
        service.request('palm://com.palm.systemservice', {
            method: 'getPreferences',
            parameters: {
                'keys': ['locale']
            },
            onSuccess: function(inResponse) {
                var locale = inResponse.locale.languageCode + "_" + inResponse.locale.countryCode.toLocaleUpperCase();
                successCallback(locale);
            },
            onFailure: errorCallback
        });
    }
};
