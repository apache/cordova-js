var port = null,
    token = null,
    xmlhttp;

function startXhr() {
    // cordova/exec depends on this module, so we can't require cordova/exec on the module level.
    var exec = require('cordova/exec'),
    xmlhttp = new XMLHttpRequest();

    // Callback function when XMLHttpRequest is ready
    xmlhttp.onreadystatechange=function(){
        if (!xmlhttp) {
            return;
        }
        if (xmlhttp.readyState === 4){
            // If callback has JavaScript statement to execute
            if (xmlhttp.status === 200) {

                // Need to url decode the response
                var msg = decodeURIComponent(xmlhttp.responseText);
                setTimeout(function() {
                    try {
                        var t = eval(msg);
                    }
                    catch (e) {
                        // If we're getting an error here, seeing the message will help in debugging
                        console.log("JSCallback: Message from Server: " + msg);
                        console.log("JSCallback Error: "+e);
                    }
                }, 1);
                setTimeout(startXhr, 1);
            }

            // If callback ping (used to keep XHR request from timing out)
            else if (xmlhttp.status === 404) {
                setTimeout(startXhr, 10);
            }

            // 0 == Page is unloading.
            // 400 == Bad request.
            // 403 == invalid token.
            // 503 == server stopped.
            else {
                console.log("JSCallback Error: Request failed with status " + xmlhttp.status);
                exec.setNativeToJsBridgeMode(exec.nativeToJsModes.POLLING);
            }
        }
    };

    if (port === null) {
        port = prompt("getPort", "gap_callbackServer:");
    }
    if (token === null) {
        token = prompt("getToken", "gap_callbackServer:");
    }
    xmlhttp.open("GET", "http://127.0.0.1:"+port+"/"+token , true);
    xmlhttp.send();
}

module.exports = {
    start: function() {
        startXhr();
    },

    stop: function() {
        if (xmlhttp) {
            var tmp = xmlhttp;
            xmlhttp = null;
            tmp.abort();
        }
    },

    isAvailable: function() {
        return ("true" != prompt("usePolling", "gap_callbackServer:"));
    }
};

