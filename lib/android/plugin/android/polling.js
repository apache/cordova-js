var cordova = require('cordova'),
    period = 50,
    enabled = false;


function doPoll() {
    if (!enabled) {
        return;
    }
    var msg = prompt("", "gap_poll:");
    if (msg) {
        try {
            eval(""+msg);
        }
        catch (e) {
            console.log("JSCallbackPolling: Message from Server: " + msg);
            console.log("JSCallbackPolling Error: "+e);
        }
        setTimeout(doPoll, 1);
    } else {
        setTimeout(doPoll, period);
    }
}

module.exports = {
    start: function() {
        enabled = true;
        setTimeout(doPoll, 1);
    },
    stop: function() {
        enabled = false;
    }
};

