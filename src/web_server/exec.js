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

// FIXME: Needs to be converted into a config parameter.
var host = 'http://localhost:3000/api/';
var Q = require('cordova/q');

/**
 * Pretty much every plugin, under the hood will make a call
 * to this method passing the service/action/args to specify
 * what they want to do. This would act as part of the bridge
 * to the native code, but in our case we'll just format urls
 * in the form of "http://host/api/service/action". The args
 * will be past in the body of the request as a json object.
 *
 * @param success the success callback if all goes well.
 * @param success the success callback if all goes well.
 * @param service the service to call ex. 'Contacts'.
 * @param action the method to call within the service.
 * @param args an array of the arguments for the action.
 * @param isAsync
 *
 * @returns a hash with {promise: Promise, response: String}
 */
 module.exports = function(success, fail, service, action, args, isAsync) {
    if (isAsync === undefined) isAsync = true;

    var apiUrl = host + service.toLowerCase() + '/' + action.toLowerCase();

    if (isAsync) {
        var response = '';
        return {'promise': Q.Promise(function (resolve, reject, notify) {
            var xhr = new XMLHttpRequest();
            xhr.onload = onLoad;
            xhr.onerror = onError;

            xhr.open('POST', apiUrl, true);
            // Need to tell the request what kind of request we are making.
            xhr.setRequestHeader("Content-type", "application/json");
            // Make sure to stringify so that we can send the correct data.
            xhr.send(JSON.stringify(args));

            // Callback functions
            function onLoad() {
                if (xhr.readyState==4 && xhr.status==200) {
                    response = xhr.responseText;
                    resolve(response);
                } else {
                    if (fail) fail(xhr.responseText);
                    reject(new Error(xhr.responseText));
                }
            }
            function onError() {
                if (fail) fail(xhr.responseText);
                reject(new Error("Can't XHR " + JSON.stringify(apiUrl)));
            }

            // Unused, but remains for reference.
            function onProgress(event) {
                notify(event.loaded / event.total);
            }
        }).then(function (value) {
            if (success) success(JSON.parse(value));
        }).fail(function (value){
            if (fail) fail(xhr.responseText);
        }),
        'response': response};
    } else if (!isAsync) {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', apiUrl, false);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = stateChange;
        xhr.onerror = onError;
        xhr.send(JSON.stringify(args));

        function stateChange() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (success) success(JSON.parse(xhr.responseText));
                } else {
                    if (fail) fail(xhr.responseText);
                }
            }
        };
        function onError() {
            if (fail) {
                fail(xhr.responseText);
            } else {
                console.log(Error(xhr, xhr.status));
            }
        };

        return {'promise': Q(JSON.parse(xhr.responseText)),
            'response': xhr.responseText};
    }
};
