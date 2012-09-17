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

var cordova = require('cordova'),
    POLL_INTERVAL = 50,
    enabled = false;

function pollOnce() {
    var msg = prompt("", "gap_poll:");
    if (msg) {
        try {
            eval(""+msg);
        }
        catch (e) {
            console.log("JSCallbackPolling: Message from Server: " + msg);
            console.log("JSCallbackPolling Error: "+e);
        }
        return true;
    }
    return false;
}

function doPoll() {
    if (!enabled) {
        return;
    }
    var nextDelay = POLL_INTERVAL;
    if (pollOnce()) {
        nextDelay = 0;
    }
    setTimeout(doPoll, nextDelay);
}

module.exports = {
    start: function() {
        enabled = true;
        setTimeout(doPoll, 1);
    },
    stop: function() {
        enabled = false;
    },
    pollOnce: pollOnce
};

