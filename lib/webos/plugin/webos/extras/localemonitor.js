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

//Monitors the for locale changes and emitts a document event is occurring.

var service = require('cordova/plugin/webos/service');

//locale monitor subscription
module.exports = {
    start: function() {
        if(!this.request) {
            this.request = service.request('palm://com.palm.systemservice', {
                method: 'getPreferences',
                parameters: {
                    keys: ["localeInfo"],
                },
                onSuccess: function (inResponse) {
                    if(inResponse.localeInfo) {
                        if(navigator.localeInfo) {
                            if((navigator.localeInfo.locales.UI !== inResponse.localeInfo.locales.UI) ||
                                    (navigator.localeInfo.timezone !== inResponse.localeInfo.timezone) ||
                                    (navigator.localeInfo.clock !== inResponse.localeInfo.clock)) {
                                cordova.fireDocumentEvent("localechange");
                            }
                        }
                        navigator.localeInfo = inResponse.localeInfo;
                    }
                },
                onFailure: function(inError) {
                    console.error("Locale monitor subscribe:error");
                },
                subscribe: true,
                resubscribe: true
            })
        };
    },
    stop: function() {
        if(this.request) {
            this.request.cancel();
            this.request = undefined;
        }
    },
    //returns the current localeinfo
    getInfo: function() {
        return navigator.localeInfo;
    }
};

document.addEventListener("deviceready", function() {
    module.exports.start();
});