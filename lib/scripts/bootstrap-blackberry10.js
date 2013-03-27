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
        function () {
            console.log('Unable to load plugins.json');
            webworksReady = true;
            fireWebworksReadyEvent();
        }
    );
}());

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("webworksready", function () {
        require('cordova/channel').onNativeReady.fire();
    });
});
