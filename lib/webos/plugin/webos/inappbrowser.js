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
var origOpenFunc = modulemapper.getOriginalSymbol(window, 'open');
var fireWindowEvent = function(win, data) {
    var event = document.createEvent('Events');
    event.initEvent(data.type, false, false);
    for(var x in data) {
        event[x] = data[x];
    }
    win.dispatchEvent(event);
};

module.exports = function(strUrl, strWindowName, strWindowFeatures) {
    var child = origOpenFunc.apply(window, arguments);
    
    if(child) {
        if(child.PalmSystem) {
            child.PalmSystem.stageReady();
        }
        //window has been created, so fire "loadstart" immediately
        fireWindowEvent(child, {type:"loadstart", url:child.location.href});
        
        var loaded = false;
    
        //fire "loadstop" when loading finishes
        child.addEventListener("load", function(e) {
            if(!loaded) {
                fireWindowEvent(child, {type:"loadstop", url:child.location.href});
                loaded = true;
            }
        });
        if(!strUrl || strUrl.length==0 || strUrl==="about:blank") {
            setTimeout(function() {
                fireWindowEvent(child, {type:"loadstop", url:""});
                loaded = true;
            }, 0);
        }
    
        //fire "loaderror" when an error occurs or the user aborts loading
        child.addEventListener("error", function(e) {
            fireWindowEvent(child, {type:"loaderror", url:child.location.href,
                    code:(e.lineno || 1), message:(e.message || "Error loading page")});
            loaded = true;
        });
        child.addEventListener("abort", function(e) {
            fireWindowEvent(child, {type:"loaderror", url:child.location.href,
                    code:2, message:"Page load aborted"});
            loaded = true;
        });
    
        child.addEventListener("unload", function(e) {
            if(loaded) {
                fireWindowEvent(child, {type:"exit", url:child.location.href});
            }
        });
    
        child.executeScript = function(injectDetails, callback) {
            if(injectDetails.code) {
                var result = child.eval(injectDetails.code);
                callback(result);
            } else if (injectDetails.file) {
                if(child.document.readyState === "interactive" || child.document.readyState === "complete" ||
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
    
        child.insertCSS = function(injectDetails, callback) {
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

