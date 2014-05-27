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
 var exec = require('cordova/exec');
/*
 *  When setting up our client side, one of the first tasks should be to
 *  override any methods used by our application. Thus we are taking on
 *  the localStorage methods in this place.	
 */
 module.exports = {
    id: 'web_server',
    initialize: function() {
        console.log('Initializing web_server cordova-js file.');
    },
    bootstrap: function() {
        // This can afford to be asynchronous.
        window.localStorage.setItem = function(key, value) {
            exec(null, null, 'localStorage', 'setItem', [key, value], true).promise
            .fail(function (error) {
                console.log(Error(error));
                console.log("Could not set the local storage.");
            })
            .done();
        };
        // FIXME: Should eventually augment the api to allow for a callback and then
        // make it async. Ex. getItem = function(key, callback);
        window.localStorage.getItem = function(key) {
            var inspector = exec(null, null, 'localStorage', 'getItem', [key], false).response;
            if (!inspector) {
                console.log('Could not find the data you were looking for. Make sure it was properly set.');
                inspector = "{}";
            }
            return inspector;
        };
        require('cordova/channel').onNativeReady.fire();
    }
};
