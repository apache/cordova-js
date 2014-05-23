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
 *	Need to investigate other platforms to see if more should be
 *	be in here.
*/
module.exports = {
    id: 'web_server',
    initialize: function() {
        console.log('Initializing web_server cordova-js file.');

        // Do we need a promise out here to make sure things finish before getting items?

        // These seem to sort of work, but not really sure if it's
        // the best way to do things. Ideally it would be in some web_server specific file.
        // This can afford to be asynchronous.
        // var originalStorage = window.localStorage.setItem;
        window.localStorage.setItem = function(key, value) {
            exec(null, null, 'localStorage', 'setItem', [key, value])
            .then(function (response) {
				console.log("Set the item(" + key + ") to :" + response);
            }, function (error) {
				console.log(Error(error));
				alert("Could not set the local storage.");
            })
            .done();

            // this lets us stay compatible for now.
            // originalStorage(key, value);
        };
// Retain usage of original getItem for method the time being.
/*window.localStorage.getItem = function(key) {
console.log("Lets pretend to return value:" + key);
// In this case, I need to return a value.
return Q.when(exec(methodName, null, 'localStorage', 'getItem', [key]), win, fail).promise;

// needs to have a callback.
function win(data) {
//callback
// how to set?
}
function fail(err) {
console.log(Error(err));
}
};*/
	},
    bootstrap: function() {
        require('cordova/channel').onNativeReady.fire();
	}
};
