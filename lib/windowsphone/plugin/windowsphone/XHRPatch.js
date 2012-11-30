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

// TODO: the build process will implicitly wrap this in a define() call
// with a closure of its own; do you need this extra closure?

var LocalFileSystem = require('cordova/plugin/LocalFileSystem');

(function (win, doc) {

var docDomain = null;
try {
    docDomain = doc.domain;
} catch (err) {
    //console.log("caught exception trying to access document.domain");
}

if (!docDomain || docDomain.length === 0) {

    var aliasXHR = win.XMLHttpRequest;

    win.XMLHttpRequest = function () { };
    win.XMLHttpRequest.noConflict = aliasXHR;
    win.XMLHttpRequest.UNSENT = 0;
    win.XMLHttpRequest.OPENED = 1;
    win.XMLHttpRequest.HEADERS_RECEIVED = 2;
    win.XMLHttpRequest.LOADING = 3;
    win.XMLHttpRequest.DONE = 4;

    win.XMLHttpRequest.prototype = {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4,

        isAsync: false,
        onreadystatechange: null,
        readyState: 0,
        _url: "",
        timeout: 0,
        withCredentials: false,
        _requestHeaders: null,
        open: function (reqType, uri, isAsync, user, password) {

            if (uri && uri.indexOf("http") === 0) {
                if (!this.wrappedXHR) {
                    this.wrappedXHR = new aliasXHR();
                    var self = this;

                    // timeout
                    if (this.timeout > 0) {
                        this.wrappedXHR.timeout = this.timeout;
                    }
                    Object.defineProperty(this, "timeout", {
                        set: function (val) {
                            this.wrappedXHR.timeout = val;
                        },
                        get: function () {
                            return this.wrappedXHR.timeout;
                        }
                    });



                    if (this.withCredentials) {
                        this.wrappedXHR.withCredentials = this.withCredentials;
                    }
                    Object.defineProperty(this, "withCredentials", {
                        set: function (val) {
                            this.wrappedXHR.withCredentials = val;
                        },
                        get: function () {
                            return this.wrappedXHR.withCredentials;
                        }
                    });


                    Object.defineProperty(this, "status", { get: function () {
                        return this.wrappedXHR.status;
                    }
                    });
                    Object.defineProperty(this, "responseText", { get: function () {
                        return this.wrappedXHR.responseText;
                    }
                    });
                    Object.defineProperty(this, "statusText", { get: function () {
                        return this.wrappedXHR.statusText;
                    }
                    });

                    Object.defineProperty(this, "responseXML", { get: function () {
                        return this.wrappedXHR.responseXML;
                    }
                    });

                    this.getResponseHeader = function (header) {
                        return this.wrappedXHR.getResponseHeader(header);
                    };
                    this.getAllResponseHeaders = function () {
                        return this.wrappedXHR.getAllResponseHeaders();
                    };

                    this.wrappedXHR.onreadystatechange = function () {
                        self.changeReadyState(self.wrappedXHR.readyState);
                    };
                }
                return this.wrappedXHR.open(reqType, uri, isAsync, user, password);
            }
            else {
                // x-wmapp1://app/www/page2.html
                // need to work some magic on the actual url/filepath
                var newUrl = uri;
                if (newUrl.indexOf(":/") > -1) {
                    newUrl = newUrl.split(":/")[1];
                }
                // prefix relative urls to our physical root
                if(newUrl.indexOf("app/www/") < 0 && this.getContentLocation() == this.contentLocation.ISOLATED_STORAGE)
                {
                    newUrl = "app/www/" + newUrl;
                }

                if (newUrl.lastIndexOf("/") === newUrl.length - 1) {
                    newUrl += "index.html"; // default page is index.html, when call is to a dir/ ( why not ...? )
                }
                this._url = newUrl;
            }
        },
        statusText: "",
        changeReadyState: function (newState) {
            this.readyState = newState;
            if (this.onreadystatechange) {
                this.onreadystatechange();
            }
        },
        setRequestHeader: function (header, value) {
            if (this.wrappedXHR) {
                this.wrappedXHR.setRequestHeader(header, value);
            }
        },
        getResponseHeader: function (header) {
            return this.wrappedXHR ? this.wrappedXHR.getResponseHeader(header) : "";
        },
        getAllResponseHeaders: function () {
            return this.wrappedXHR ? this.wrappedXHR.getAllResponseHeaders() : "";
        },
        responseText: "",
        responseXML: "",
        onResult: function (res) {
            this.status = 200;
            if(typeof res == "object")
            {   // callback result handler may have already parsed this from a string-> a JSON object,
                // if so, we need to restore its stringyness, as handlers are expecting string data.
                // especially if used with jQ -> $.getJSON
                res = JSON.stringify(res);
            }
            this.responseText = res;
            this.responseXML = res;
            this.changeReadyState(this.DONE);
        },
        onError: function (err) {
            this.status = 404;
            this.changeReadyState(this.DONE);
        },

        abort: function () {
            if (this.wrappedXHR) {
                return this.wrappedXHR.abort();
            }
        },

        send: function (data) {
            if (this.wrappedXHR) {
                return this.wrappedXHR.send(data);
            }
            else {
                this.changeReadyState(this.OPENED);

                var alias = this;

                var fail = function fail(evt) {
                    alias.onError(evt.code);
                };

                if (alias.getContentLocation() == this.contentLocation.RESOURCES) {
                    var exec = require('cordova/exec');
                    exec(function(result) {
                            alias.onResult.apply(alias, [result]);
                        },
                        fail,
                        "File", "readResourceAsText", [alias._url]
                    );
                }
                else {
                    var gotFile = function gotFile(file) {
                        var reader = new FileReader();
                        reader.onloadend = function (evt) {
                            alias.onResult.apply(alias,[evt.target.result]);
                        };
                        reader.readAsText(file);
                    };

                    var gotEntry = function gotEntry(entry) {
                        entry.file(gotFile, fail);
                    };

                    var gotFS = function gotFS(fs) {
                        fs.root.getFile(alias._url, null, gotEntry, fail);
                    };

                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
                }
            }
        },

        getContentLocation: function () {
            if (window.contentLocation === undefined) {
                window.contentLocation = (navigator.userAgent.toUpperCase().indexOf('MSIE 10') > -1) ?
                    this.contentLocation.RESOURCES : this.contentLocation.ISOLATED_STORAGE;
            }

            return window.contentLocation;
        },

        contentLocation:{
            ISOLATED_STORAGE: 0,
            RESOURCES: 1
        },

        status: 404
    };
} // if doc domain

// end closure wrap
})(window, document);

module.exports = null;
