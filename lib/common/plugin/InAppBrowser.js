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
var channel = require('cordova/channel');

function InAppBrowser() {
   this.channels = {
        'loadstart': channel.create('loadstart'),
        'loadstop' : channel.create('loadstop'),
        'loaderror' : channel.create('loaderror'),
        'exit' : channel.create('exit')
   };
   this.originalWindowOpen = window.open;
}

InAppBrowser.prototype = {
    _eventHandler: function (event) {
        if (event.type in this.channels) {
            this.channels[event.type].fire(event);
        }
    },
    close: function (eventname) {
        exec(null, null, "InAppBrowser", "close", []);
    },
    addEventListener: function (eventname,f) {
        if (eventname in this.channels) {
            this.channels[eventname].subscribe(f);
        }
    },
    removeEventListener: function(eventname, f) {
        if (eventname in this.channels) {
            this.channels[eventname].unsubscribe(f);
        }
    },
    executeScript: function(injectDetails, cb) {
        var script,
            sourceString;
        if (injectDetails.code) {
            exec(cb, null, "InAppBrowser", "injectScriptCode", [injectDetails.code]);
        } else if (injectDetails.file) {
            sourceString = JSON.stringify(injectDetails.file);
            script = "(function(d) { var c = d.createElement('script'); c.src = " + sourceString + "; d.body.appendChild(c); })(document)";
            exec(cb, null, "InAppBrowser", "injectScriptCode", [script]);
        } else {
            throw new Error('executeScript requires exactly one of code or file to be specified');
        }
    },
    insertCSS: function(injectDetails, cb) {
        var script,
            sourceString;
        if (injectDetails.code) {
            sourceString = JSON.stringify(injectDetails.code);
            script = "(function(d) { var c = d.createElement('style'); c.innerHTML = " + sourceString + "; d.body.appendChild(c); })(document)";
            exec(cb, null, "InAppBrowser", "injectScriptCode", [script]);
        } else if (injectDetails.file) {
            sourceString = JSON.stringify(injectDetails.file);
            script = "(function(d) { var c = d.createElement('link'); c.rel='stylesheet', c.type='text/css'; c.href = " + sourceString + "; d.body.appendChild(c); })(document)";
            exec(cb, null, "InAppBrowser", "injectScriptCode", [script]);
        } else {
            throw new Error('insertCSS requires exactly one of code or file to be specified');
        }
    }
};

module.exports = function(strUrl, strWindowName, strWindowFeatures) {
    var iab = new InAppBrowser();
    var cb = function(eventname) {
       iab._eventHandler(eventname);
    };

    if (window.frames && window.frames[strWindowName]) {
        return this.originalWindowOpen(strUrl, strWindowName, strWindowFeatures);
    } else {
        exec(cb, cb, "InAppBrowser", "open", [strUrl, strWindowName, strWindowFeatures]);
        return iab;
    }
};

