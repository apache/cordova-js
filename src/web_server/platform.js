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
    /*
     *  After the app has been set up and ready to use, this gets invoked
     *  to accomplish any other desired functions.
    */
    initialize: function() {
    },
    /*
     *  Gets run before any of the client side code is allowed, thus any
     *  method overrides or special data handling shoudl go here.
    */
    bootstrap: function() {
        // This can afford to be asynchronous.
        window.localStorage.setItem = function(key, value, success, fail) {
            exec(success, fail, 'localStorage', 'setItem', [key, value], true).promise
            .fail(function (error) {
                console.log(Error(error));
                console.log("Could not set the local storage.");
            })
            .done();
        };
        window.localStorage.getItem = function(key, success, fail) {
            var isasync = typeof success == 'function';
            var ret = exec(success, fail, 'localStorage', 'getItem', [key], isasync).response;

            // If we are running async the success call back will handle the eventual response.
            if (isasync) {
                return '{}';
            } else if (!ret) {
                console.log('Could not find the data you were looking for. Make sure it was properly set.');
                ret = "{}";
            }
            return ret;
        };
        require('cordova/channel').onNativeReady.fire();
    }
};
