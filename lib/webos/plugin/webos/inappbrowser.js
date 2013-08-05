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

var channel = require('cordova/channel');
var modulemapper = require('cordova/modulemapper');

module.exports = function(strUrl, strWindowName, strWindowFeatures) {
    var iab = new InAppBrowser();
    var cb = function(eventname) {
       iab._eventHandler(eventname);
    };

    var origOpenFunc = modulemapper.getOriginalSymbol(window, 'open');
    var child = origOpenFunc.apply(window, arguments);
    
    if(child) {
        child.channels = {
            'loadstart': channel.create('loadstart'),
            'loadstop' : channel.create('loadstop'),
            'loaderror' : channel.create('loaderror'),
            'exit' : channel.create('exit')
        };
    
        //overwrite default event listener functions to filter out cordova pseudo-events
        var eventFilter = ["loadstart", "loadstop", "loaderror", "exit"];
        var origAddEventListener = child.addEventListener;
        child.addEventListener = function (e,f) {
            if (e in this.channels) {
                child.channels[e].subscribe(f);
            } else {
                origAddEventListener.apply(child, arguments);
            }
        };
        var origRemoveEventListener = child.removeEventListener;
        child.removeEventListener = function(e, f) {
            if (e in this.channels) {
                child.channels[e].unsubscribe(f);
            } else {
                origRemoveEventListener.apply(child, arguments);
            }
        };
    
        //window has been created, so fire "loadstart" immediately
        child.channels.loadstart.fire({type:"loadstart", target:child});
    
        //fire "loadstop" when loading finishes
        child.addEventListener("load", function(e) {
            e = e || {};
            e.type = "loadstop";
            child.channels.loadstop.fire(e);
        });
    
        //fire "loaderror" when an error occurs or the user aborts loading
        child.addEventListener("error", function(e) {
            e = e || {};
            e.type = "loaderror";
            child.channels.loaderror.fire(e);
        });
        child.addEventListener("abort", function(e) {
            e = e || {};
            e.type = "loaderror";
            child.channels.loaderror.fire(e);
        });
    
        child.addEventListener("beforeunload", function(e) {
            e = e || {};
            e.type = "exit";
            child.channels.loaderror.fire(e);
        });
    
        child.executeScript = function(injectDetails, callback) {
            if(injectDetails.code) {
                var result = child.eval(injectDetails.code);
                callback(result);
            } else if (injectDetails.file) {
                if (child.document.readyState === "interactive" || child.document.readyState === "complete" ||
                        child.document.readyState === "loaded") {
                    var script = child.document.createElement('script');
                    script.src = injectDetails.file;
                    script.onload = callback;
                    script.onerror = callback;
                    script.charset = "utf-8";
                    child.document.getElementsByTagName('head')[0].appendChild(script);
                } else {
                    /* jshint evil: true */
                    child.document.write(
                            '<scri' + 'pt src="' + injectDetails.file + '"' +
                            (onLoad ? ' onload="' + callback + '"' : '') +
                            (onError ? ' onerror="' + callback + '"' : '') +
                            '></scri' + 'pt>');
                    /* jshint evil: false */
                }
            } else {
                throw new Error('executeScript requires exactly one of code or file to be specified');
            }
        };
    
        window.insertCSS = function(injectDetails, callback) {
            var ready = (child.document.readyState === "interactive" || child.document.readyState === "complete" ||
                        child.document.readyState === "loaded");
            if(injectDetails.code) {
                if(ready) {
                    var style = child.document.createElement('style');
                    style.media = "screen";
                    style.type = "text/css";
                    style.appendChild(document.createTextNode(injectDetails.code));
                    child.document.getElementsByTagName('head')[0].appendChild(style);
                } else {
                    /* jshint evil: true */
                    child.document.write(
                            '<style media="screen" type="text/css" >' +
                            injectDetails.code + '</style>');
                    /* jshint evil: false */
                }
            } else if(injectDetails.file) {
                if(ready) {
                    var link = child.document.createElement('link');
                    link.href = inPath;
                    link.media = "screen";
                    link.rel = "stylesheet";
                    link.type = "text/css";
                    child.document.getElementsByTagName('head')[0].appendChild(link);
                } else {
                    /* jshint evil: true */
                    child.document.write(
                            '<link href="' + inPath + '" media="screen" rel="' +
                            'stylesheet" type="text/css" />');
                    /* jshint evil: false */
                }
            } else {
                throw new Error('insertCSS requires exactly one of code or file to be specified');
            }
        }
    }
    
    return child;
};

