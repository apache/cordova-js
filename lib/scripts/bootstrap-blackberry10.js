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

(function () {
    var pluginUtils = require('cordova/plugin/blackberry10/pluginUtils'),
        docAddEventListener = document.addEventListener,
        webworksReady = false,
        alreadyFired = false,
        listenerRegistered = false;

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

    //Trapping when users add listeners to the webworks ready event
    //This way we can make sure not to fire the event before there is a listener
    document.addEventListener = function (event, callback, capture) {
        docAddEventListener.call(document, event, callback, capture);
        if (event.toLowerCase() === 'webworksready') {
            listenerRegistered = true;
            fireWebworksReadyEvent();
        }
    };

    //Fire webworks ready once plugin javascript has been loaded
    pluginUtils.getPlugins(
        function (plugins) {
            pluginUtils.loadClientJs(plugins, function () {
                webworksReady = true;
                fireWebworksReadyEvent();
            });
        },
        function (e) {
            console.log(e);
        }
    );

    /**
     * webworks.exec
     *
     * This will all be moved into lib/blackberry10/exec once cordova.exec can be replaced
     */

    function RemoteFunctionCall(functionUri) {
         var params = {};

        function composeUri() {
            return require("cordova/plugin/blackberry10/utils").getURIPrefix() + functionUri;
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
            errored = response.code < 0;
            cb = errored ? error : success;
            data = errored ? response.msg : response.data;

            if (cb) {
                cb(data, response);
            }
            else if (errored) {
                throw data;
            }

            return data;
        };
    }

    window.webworks = {
        exec: function (success, fail, service, action, args) {
            var uri = service + "/" + action,
                request = new RemoteFunctionCall(uri),
                name;

            for (name in args) {
                if (Object.hasOwnProperty.call(args, name)) {
                    request.addParam(name, args[name]);
                }
            }

            return request.makeSyncCall(success, fail);
        },
        defineReadOnlyField: function (obj, field, value) {
            Object.defineProperty(obj, field, {
                "value": value,
                "writable": false
            });
        },
        event: require("cordova/plugin/blackberry10/event")
    };
}());

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("webworksready", function () {
        require('cordova/channel').onNativeReady.fire();
    });
});
