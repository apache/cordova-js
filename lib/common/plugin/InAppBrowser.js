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

function InAppBrowser()
{
   var _channel = require('cordova/channel');
   this.channels = {
        'loadstart': _channel.create('loadstart'),
        'loadstop' : _channel.create('loadstop'),
        'exit' : _channel.create('exit')
   };
}

InAppBrowser.prototype._eventHandler = function(event)
{
    if (event.type in this.channels) {
        this.channels[event.type].fire(event);
    }
}

InAppBrowser.open = function(strUrl, strWindowName, strWindowFeatures)
{
    var iab = new InAppBrowser();
    var cb = function(eventname) {
       iab._eventHandler(eventname);
    }
    exec(cb, null, "InAppBrowser", "open", [strUrl, strWindowName, strWindowFeatures]);
    return iab;
}

InAppBrowser.prototype.close = function(eventname, f)
{
    exec(null, null, "InAppBrowser", "close", []);
}

InAppBrowser.prototype.addEventListener = function(eventname, f)
{
    if (eventname in this.channels) {
        this.channels[eventname].subscribe(f);
    }
}

InAppBrowser.prototype.removeEventListener = function(eventname, f)
{
    if (eventname in this.channels) {
        this.channels[eventname].unsubscribe(f);
    }
}

module.exports = InAppBrowser.open;

