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
var host = 'http://localhost:3000';

/**
 * Pretty much every plugin, under the hood will make a call
 * to this method passing the service/action/args to specify
 * what they want to do. This would act as part of the bridge
 * to the native code, but in our case we'll just format urls
 * in the form of "http://host/api/service/action". The args
 * will be past in the body of the request as a json object.
 *
 * @param sucess the success callback if all goes well.
 * @param sucess the success callback if all goes well.
 * @param service the service to call ex. 'Contacts'.
 * @param action the method to call within the service.
 * @param args the arguments for the action.
*/
module.exports = function(success, fail, service, action, args) {
    console.log("Calling " + service + " :: " + action + " args:: \n" + JSON.stringify(args[0]));

    var apiUrl = host + '/api/' + service.toLowerCase() + '/' + action.toLowerCase();

    var xhr = new XMLHttpRequest();

    // How do I know when it will be get or post? Could just always do post but some
    // urls won't need any data to accomplish some task. How can we know when it should be
    // asychronous?
    xhr.open('POST', apiUrl, true);

    // Need to tell the request what kind of request we are making.
    xhr.setRequestHeader("Content-type", "application/json");

    // Make sure to stringify so that we can send the correct data.
    xhr.send(JSON.stringify(args[0]));
    var obj = xhr.responseText;
    console.log(obj);
    return obj;
};
