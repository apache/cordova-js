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

module.exports = {
    id: "blackberry10",
    bootstrap: function() {
        var cordova = require('cordova'),
            channel = require('cordova/channel'),
            addDocumentEventListener = document.addEventListener,
            webworksReady = false,
            alreadyFired = false,
            listenerRegistered = false;

        //override to pass online/offline events to window
        document.addEventListener = function (type) {
            if (type === "online" || type === "offline") {
                window.addEventListener.apply(window, arguments);
            } else {
                addDocumentEventListener.apply(document, arguments);
                //Trapping when users add listeners to the webworks ready event
                //This way we can make sure not to fire the event before there is a listener
                if (type.toLowerCase() === 'webworksready') {
                    listenerRegistered = true;
                    fireWebworksReadyEvent();
                }
            }
        };

        channel.onDOMContentLoaded.subscribe(function () {
            document.addEventListener("webworksready", function () {
                channel.onNativeReady.fire();
            });
        });

        channel.onPluginsReady.subscribe(function () {
            webworksReady = true;
            fireWebworksReadyEvent();
        });


        //Only fire the webworks event when both webworks is ready and a listener is registered
        function fireWebworksReadyEvent() {
            var evt;
            if (listenerRegistered && webworksReady && !alreadyFired) {
                alreadyFired = true;
                evt = document.createEvent('Events');
                evt.initEvent('webworksready', true, true);
                document.dispatchEvent(evt);
            }
        }

        function RemoteFunctionCall(functionUri) {
            var params = {};

            function composeUri() {
                return "http://localhost:8472/" + functionUri;
            }

            function createXhrRequest(uri, isAsync) {
                var request = new XMLHttpRequest();
                request.open("POST", uri, isAsync);
                request.setRequestHeader("Content-Type", "application/json");
                return request;
            }

            this.addParam = function (name, value) {
                params[name] = encodeURIComponent(JSON.stringify(value));
            };

            this.makeSyncCall = function (success, error) {
                var requestUri = composeUri(),
                request = createXhrRequest(requestUri, false),
                response,
                errored,
                cb,
                data;

                request.send(JSON.stringify(params));
                response = JSON.parse(decodeURIComponent(request.responseText) || "null");
                return response;
            };
        }

        window.webworks = {
            exec: function (success, fail, service, action, args) {
                var uri = service + "/" + action,
                request = new RemoteFunctionCall(uri),
                callbackId = service + cordova.callbackId++,
                response,
                name,
                didSucceed;

                for (name in args) {
                    if (Object.hasOwnProperty.call(args, name)) {
                        request.addParam(name, args[name]);
                    }
                }

                cordova.callbacks[callbackId] = {success:success, fail:fail};
                request.addParam("callbackId", callbackId);

                response = request.makeSyncCall();

                //Old WebWorks Extension success
                if (response.code === 42) {
                    if (success) {
                        success(response.data, response);
                    }
                    delete cordova.callbacks[callbackId];
                } else if (response.code < 0) {
                    if (fail) {
                        fail(response.msg, response);
                    }
                    delete cordova.callbacks[callbackId];
                } else {
                    didSucceed = response.code === cordova.callbackStatus.OK || response.code === cordova.callbackStatus.NO_RESULT;
                    cordova.callbackFromNative(callbackId, didSucceed, response.code, [ didSucceed ? response.data : response.msg ], !!response.keepCallback);
                }
            },
            defineReadOnlyField: function (obj, field, value) {
                Object.defineProperty(obj, field, {
                    "value": value,
                    "writable": false
                });
            }
        };

        //map blackberry.event to document for backwards compatibility
        if (!window.blackberry) {
            window.blackberry = {};
        }
        window.blackberry.event = 
        {
            addEventListner: document.addEventListener,
            removeEventListener: document.removeEventListener
        }
    }
};
