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

